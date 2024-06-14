const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');
module.exports = {createPoll, addReactions}

function createPoll(user, thumb, question){
    const pollEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(thumb)
        .setTitle("Poll")
        .setFields(
            { name: `${user} has posed the following question`, value: '\u200b' },
            { name: question, value: '\u200b'},
            { name: '\u200b', value: "👍 for Yes, 👎 for No, 😶 for no opinion" }
        )
    return(pollEmbed)
}
function addReactions(pollQuestion){
	pollQuestion.react("👍")
		.then(() => pollQuestion.react("👎"))
		.then(() => pollQuestion.react("😶"))
		.catch(err => console.error(`${timestamp()} - server: ${pollQuestion.guild.name} - Command: Poll - One of the emojis failed to react. ${err}`));
}