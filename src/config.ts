import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV;
const chatbotApi = process.env.CHATBOT_API;
const maxChannels = process.env.MAX_CHANNELS;

export { env, chatbotApi, maxChannels };
