import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const chatbotApi = `${process.env.CHATBOT_API}:${process.env.API_PORT}`;
const apiRetry = process.env.API_RETRY;
const apiRetryTime = process.env.API_RETRY_MILLISECONDS;
const maxChannels = process.env.MAX_CHANNELS;

export { chatbotApi, port, apiRetry, apiRetryTime, maxChannels };
