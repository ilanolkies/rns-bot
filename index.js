const TelegramBot = require('node-telegram-bot-api');
const Web3 = require('web3');
const RNS = require('@rsksmart/rns');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Connect to the RSK network
const web3 = new Web3('https://public-node.rsk.co');

// Connect to the RNS service
const rns = new RNS(web3);

// Matches "/addr [whatever]"
bot.onText(/\/addr (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  // Query the address of the captured [whatever]
  rns.addr(match[1])
    .then(addr =>  { // answer the address
      const resp = `The address is ${addr}`;
      bot.sendMessage(chatId, resp)
    })
    .catch(error => { // answer error when not found and a reference if existent
      const resp = `Error: ${error.message}. ${error.ref ? `Find more info at ${error.ref}` : ``}`;
      bot.sendMessage(chatId, resp)
    });
});
