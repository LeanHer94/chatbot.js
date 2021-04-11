import axios from "axios";
import { chatbotApi } from './config';

const api = chatbotApi;
const irc = require('irc');

const ircConfig = {
  server: 'irc.freenode.net',
  port: 6667,
  nick: 'LxbTimeZoneGuru',
  channel: '#lxbuniquekdskds'
}

const commands = {
  "!timeat": {
    fn: async (timezone: string) => { return await axios.post(`${api}/timeat`, { Timezone: timezone }) },
    msg: (timezone: string, result: string | number) => `Current time at ${timezone} is ${result}`
  },
  "!timepopularity": {
    fn: async (timezone: string) => { return await axios.post(`${api}/timepopularity`, { Timezone: timezone }) },
    msg: (timezone: string, result: string | number) => `${timezone} has been searched ${result} times`
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

client.addListener('message', async function (from, to, message) {
  const words = message.split(' ');
  const command = words[0];

  if (commands[command]) {
    client.say(ircConfig.channel, 'Looking for your request...');

    const result = await commands[command].fn(words[1]);
    const message = commands[command].msg(words[1], result.data);

    client.say(ircConfig.channel, message);
  } else {
    client.say(ircConfig.channel, 'You idiot');
  }
});