require('dotenv').config();
const {Client,
	GatewayIntentBits,
	Partials,
 } = require('discord.js')
const fs = require('node:fs');
const path = require('node:path')
const { timestamp } = require('./src/timestamp.js');
const client = new Client({ 
	intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.User, Partials.Message, Partials.Reaction, Partials.Channel],
      allowedMentions: {
        repliedUser: false,
      },
      restRequestTimeout: 20000,
    });
	module.exports = {
		/**
		 * @param {Client} client
		 */
	}
	module.exports.guildInvites = new Map();
	module.exports.client = client;

//event handler https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once){
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//These dump the error to console, but there is little indication where in the script it was triggered so please handle errors in the script.
client.on('error', (err) => console.error(timestamp() + ' - Discord client caught an error: ', err));
process.on('unhandledRejection', (err) => console.error(timestamp() + ' - Unhandled Rejection.', err));
process.on('uncaughtException',  (err) => console.error(timestamp() + ' - Uncaught Exception.', err));
process.on('uncaughtExceptionMonitor', (err) => console.error(timestamp() + ' - Uncaught Exception Monitor.', err));

client.login(process.env.CLIENT_TOKEN);