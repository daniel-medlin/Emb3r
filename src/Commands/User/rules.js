const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');

module.exports.rulesEmbed = function rulesEmbed(rules, guild){//build the embed for displaying rules
    const rulesEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(guild.iconURL())
        .setTitle(guild.description)
        .setDescription(rules);
    return(rulesEmbed);
}