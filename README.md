# chatbot.js

## ENVIRONMENT
* npm i to install dependencies

### ------ To Generate SQL Databse Schema -------
* Check chatbot.api.js

### ------ To Start API ------
* npm run dev
* F5 to attach vs code debugger to nodemon process
* port 3000

### ------ To Start Bot -----
* npm run dev
* F5 to attach vs code debugger to nodemon process 9229
* port 3120

### ------ To Talk with the bot ----
* Open https://webchat.freenode.net/ on your browser
* Enter your NickName and join the channel configured in IRCClient on ChatBotServer.sln (#lxbuniquekdskds)
* To know which commands are available send !commands
* !timepopularity accepts timezones, prefixes and also suffixes (like the Vancouver example)

### ------ To Test the API -----
* Open Postman
* Make a POST request to http://localhost:3000 + timeat / timepopularity
* Set Body RAW JSON with content like { "Timezone": "Vancouver" }
