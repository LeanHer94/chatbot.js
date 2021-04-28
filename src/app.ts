import axios from "axios";
import { AppError } from "error-api.hl/lib";
import { chatbotApi } from './config';

const api = chatbotApi;
const irc = require('irc');

const ircConfig = {
  server: 'irc.freenode.net',
  port: 6667,
  nick: 'LxbTimeZoneGuru',
  channel: '#lxbuniquekdskds'
}

type Function = (timezone: string) => Promise<any>;
type Message = (timezone: string, result: string | number) => string;
interface Command {
  fn(timezone: string): Promise<any>;
  msg(timezone: string, result: string | number | AppError): string;
}

const commands: { [id: string]: Command } = {
  "!timeat": {
    fn: async (tz) => { return await axios.post(`${api}/timeat`, { Timezone: tz }) },
    msg: (tz, result)  => result instanceof AppError ? result.description : `Current time at ${tz} is ${result}`
  },
  "!timepopularity": {
    fn: async (tz) => { return await axios.post(`${api}/timepopularity`, { Timezone: tz }) },
    msg: (tz, result) => `${tz} has been searched ${result} times`
  },
  "!commands": {
    fn: async () => { return Promise.resolve({ data: "!timeat and !timepopularity" }) },
    msg: (tz, result) => `Available commands are: ${result}`
  }
}

var client = new irc.Client(
  `${ircConfig.server}`, 
  ircConfig.nick, 
  {
    channels: [ircConfig.channel], 
    port: ircConfig.port,
    retryCount: 3
  });

client.addListener('message', async function (from: any, to: any, message: string) {
  const words = message.split(' ');
  const command = words[0];

  if (commands[command]) {
    client.say(ircConfig.channel, 'Looking for your request...');

    const timezone = words[1];
    const result = await commands[command].fn(timezone);
    const message = commands[command].msg(timezone, result.data);

    client.say(ircConfig.channel, message);
  } else {
    client.say(ircConfig.channel, 'You idiot');
  }
});