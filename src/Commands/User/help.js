const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');

module.exports.helpEmbed = function helpEmbed(){//build the embed for displaying rules
    const helpEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .setTitle("__Help Message__")
        .setDescription("\n\n\
All commands are slash commands.  Admin commands are logged.  To input a slash command you can either click the + in the chat bar or start typing a forward slash (/)\n\n\
1. `/help` Display this help message.\n\
2. `/ip <ip address> private: [yes/no]` Look up geo-location information for given IP.  Must provide an IPv4 address.\n\
3. ~~/poll <poll question> Display a poll question for voting.~~ deprecated\n\
4. `/roles <add | remove | list>` Pick from a selection of user assignable roles.\n\
5. `/rules` Display the server rules.\n\
6. `/stats <server || user <target user>>` Display information about the server or a user.\n\n\
__Admin commmands__\n These commands are only available for staff \n\
1. `/delete <number>`: Must be between 1 and 99 and no older than 14 days.\n\
2. `/parrot <message> [channel]` Make the bot say what you want it to.\n\
3. `/rolemanager <add | remove | list>` Define roles for use in the /roles command.\n\
4. `/warn <user> <text>` Logs a warning against the user to server logs.");
    return(helpEmbed);
}
