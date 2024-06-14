const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');

module.exports.del = del;

async function del(interaction, channel, number){
    if (number >= 1 && number < 100){
        number = Math.floor(parseInt(number))
        try {
           await channel.bulkDelete(number)
            let message = `${number} messages in ${channel.name} deleted by ${interaction.user}`
            console.log(`${timestamp()} - server: ${interaction.guild.name} - ${number} messages in ${channel.name} deleted by ${interaction.user.username}`)
            return(message)
        } catch (error) {
            let message = `Bulk delete failed: ${error}`
            return(message);
        } 
    } else {
        return(`Bulk Delete only works on a positive number of messages between 1 and 99 newer than 2 weeks old.  Your selection was: ${number}.`)
    }
}