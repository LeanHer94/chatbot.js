import axios from "axios";
import express from "express";
import { AppError, handleError } from "error-api.hl/lib";
import { port, chatbotApi, maxChannels, host } from "./config";

const api = chatbotApi;
const irc = require("irc");

const ircConfig = {
  server: "irc.freenode.net",
  port: 6667,
  nick: "hl-timezone-guru"
};

type Function = (timezone: string) => Promise<any>;
type Message = (timezone: string, result: string | number) => string;
interface Command {
  fn(timezone: string): Promise<any>;
  msg(timezone: string, result: string | number | AppError): string;
}

const commands: { [id: string]: Command } = {
  "!timeat": {
    fn: async tz => {
      return await axios.post(`${api}/timeat`, { Timezone: tz });
    },
    msg: (tz, result) =>
      result instanceof AppError
        ? result.description
        : `Current time at ${tz} is ${result}`
  },
  "!timepopularity": {
    fn: async tz => {
      return await axios.post(`${api}/timepopularity`, { Timezone: tz });
    },
    msg: (tz, result) => `${tz} has been searched ${result} times`
  },
  "!commands": {
    fn: async () => {
      return Promise.resolve({ data: "!timeat and !timepopularity" });
    },
    msg: (tz, result) => `Available commands are: ${result}`
  }
};

const client = new irc.Client(`${ircConfig.server}`, ircConfig.nick, {
  port: ircConfig.port,
  retryCount: 3
});

const app = express();
const mxChannels = maxChannels ? +maxChannels : 1;

app.get("/test", (req, res, next) => {
  res.send("Test if this really works");
});

app.get("/join/:channel", async (req, res, next) => {
  if ((client.opt.channels.length as number) == mxChannels) {
    res.send(
      `You cannot connect to more than ${mxChannels}. Use switch/:oldchannel/:newchannel to switch.`
    );

    return;
  }

  const channel = `#${req.params.channel}`;
  join(res, channel);
});

app.get("/switch/:oldchannel/:newchannel", async (req, res, next) => {
  const oldchannel = `#${req.params.oldchannel}`;
  const newchannel = `#${req.params.newchannel}`;
  const message = `I'm living this shit but you can find me on ${newchannel}`;

  client.part(oldchannel, message, () => {
    join(res, newchannel);
  });
});

const join = (res: any, channel: string) => {
  try {
    client.join(channel, () => {
      client.addListener("message", async function (from: any, to: any, message: string) {
        const words = message.split(" ");
        const command = words[0];

        if (commands[command]) {
          client.say(channel, "Looking for your request...");

          const timezone = words[1];
          const result = await commands[command].fn(timezone);
          const message = commands[command].msg(timezone, result.data);

          client.say(channel, message);
        } else {
          client.say(channel, "That's not an available command you idiot");
        }
      });

      res.send(`${ircConfig.nick} joined to channel ${channel}.`);
    });
  } catch (err) {
    const apperr = new AppError(`${err.message}: ${err.stack}`, err);

    throw apperr;
  }
};

app.use(async (err: Error, req: any, res: any, next: any) => {
  await handleError(err, res);
});

process.on("uncaughtException", (error: Error) => {
  handleError(error);
});

process.on("unhandledRejection", (reason: any) => {
  handleError(reason);
});

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`);
});
