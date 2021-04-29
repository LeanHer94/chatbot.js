# chatbot.js ![status](https://github.com/leandro-hl/airlines.js/actions/workflows/node.js.yml/badge.svg)

## ENVIRONMENT
* npm i to install dependencies
* Ask for environment file .env

### ------ To Generate SQL Databse Schema -------
* Check chatbot.api.js

### ------ To Start Bot -----
* npm run dev
* F5 to attach vs code debugger to nodemon process 9229
* port 3120

### ------ To Talk with the bot ----
* Open https://webchat.freenode.net/ on your browser
* Enter your NickName and join the channel you want to talk on.
* use join endpoint to tell to the bot which channel should it use. It's a get request so you can simply use your browser.
* !timepopularity accepts timezones, prefixes and also suffixes (like the Vancouver example)
