import dotenv from 'dotenv'

dotenv.config()

const chatbotApiPort = process.env.API_PORT
const chatbotApi = `${process.env.CHATBOT_API}:${chatbotApiPort}`
const apiRetry = process.env.API_RETRY
const apiRetryTime = process.env.API_RETRY_MILLISECONDS

export {
    chatbotApi,
    chatbotApiPort,
    apiRetry,
    apiRetryTime
}