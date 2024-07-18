This is the "Essentially (a) Moderation Bot Rev. 3" that is used in several small tech servers on Discord.  It's been relatively customized to work with the servers but should be pretty easy to fit in most cases.

Pre-requisites:
NPM and Node.js installed.

1. From the Emb3r directory, install your node_modules using npm
  npm install
2. Edit .env and insert your bot's private token.
3. Launch the bot using node
  node bot.js


Customize to your environment:
1. Emb3r/src/Commands/Slash/slashCommands.js line 192 expects your moderator role to be name "Moderator" it can be fixed here.

2. Emb3r/src/Commands/Slash/slashCommands.js line 45 attempts to read your server rules from the rules channel.  If it is named differently, then change the name here

3. Emb3r/src/Commands/Admin/logger.js line 3 defines the name of your logs channel.
