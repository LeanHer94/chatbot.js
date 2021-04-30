import axios from "axios";
import { AppError } from "error-api.hl/lib";
import { chatbotApi, maxChannels } from "./config";

const api = chatbotApi;
const irc = require("irc");

interface Command {
  execute(channel: any, words: string[]): Promise<void>;
}

//Can't make it work without creating subclasses that implement fn and msg dunno why.
//Idea would be creting 2 TimezoneCommand objects that override that funcs but reuse execute
class TimezoneCommand implements Command {
  async execute(channel: any, words: string[]): Promise<void> {
    client.say(channel, "Looking for your request...");

    const timezone = words[1];
    const result = await this.fn(timezone);
    const message = this.msg(timezone, result.data);

    client.say(channel, message);
  }

  fn(timezone: string): Promise<any> {
    return Promise.resolve({});
  }

  msg(timezone: string, result: string | number | AppError): string {
    return "";
  }
}

const nick = "hl-timezone-guru";
const defaultChannel = "#hl-default";
const client = new irc.Client("irc.freenode.net", nick, {
  port: 6667,
  retryCount: 3,
  channels: [defaultChannel],
  sasl: true,
  userName: nick,
  password: "cckhXpydpJYupMgA1XuB"
});

const listener = async function (channel: string, message: string) {
  const words = message.split(" ");
  const typeKey = words[0];

  const type = commands[typeKey];

  if (type) {
    const commandKey = words[1];
    const command = type[commandKey];

    if (command) {
      await command.execute(channel, words);

      return;
    }
  }

  client.say(channel, "That's not an available command you idiot");
};

const addListener = (channel: string) => {
  client.addListener(
    `message${channel}`,
    async function (nick: any, text: any, message: string) {
      await listener(channel, text);
    }
  );
};

const join = (channel: string) => {
  return client.join(channel, () => {
    addListener(channel);
  });
};

const commands: { [id: string]: { [id: string]: Command | TimezoneCommand } } = {
  timezone: {
    timeat: {
      execute: async (channel: any, words: string[]): Promise<void> => {
        client.say(channel, "Looking for your request...");

        const timezone = words[2];
        const result = await axios.post(`${api}/timeat`, { Timezone: timezone });
        const message = result.data.description
          ? result.data.description
          : `Current time at ${timezone} is ${result.data}`;

        client.say(channel, message);
      }
    },
    timepopularity: {
      execute: async (channel: any, words: string[]): Promise<void> => {
        client.say(channel, "Looking for your request...");

        const timezone = words[2];
        const result = await axios.post(`${api}/timepopularity`, { Timezone: timezone });
        const message = `${timezone} has been searched ${result.data} times`;

        client.say(channel, message);
      }
    }
  },
  general: {
    commands: {
      execute: async (channel: any) => {
        const message = "timeat, timepopularity, join, swicht";

        client.say(channel, message);
      }
    }
  },
  channel: {
    join: {
      execute: async (channel: any, words: string[]) => {
        const mxChannels = maxChannels ? +maxChannels : 1;

        if ((client.opt.channels.length as number) == mxChannels) {
          client.say(
            channel,
            `You cannot connect to more than ${mxChannels}. Use channel switch oldchannel newchannel to switch.`
          );

          return;
        }

        const channelToJoin = words[2].includes("#") ? words[2] : `#${words[2]}`;

        join(channelToJoin);
      }
    },
    switch: {
      execute: async (channel: any, words: string[]) => {
        const oldchannel = `#${channel}`;
        const newchannel = `#${words[3]}`;

        client.part(oldchannel, "", () => {
          join(newchannel);
        });
      }
    }
  }
};

addListener(defaultChannel);
