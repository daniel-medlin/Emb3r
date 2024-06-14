const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const logChanName = "logs";//name of logs channel

module.exports.logger = function logger(guild, title, message){
    channel = guild.channels.cache.find(c => c.name == logChanName);
    const logEmbed = new EmbedBuilder()
        .setTitle(title)
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .setDescription(message)
        .setTimestamp()
    channel.send({embeds: [logEmbed] });
}