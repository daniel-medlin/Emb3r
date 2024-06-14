const vars = require('../../../config/config.json');
const { EmbedBuilder }=require('discord.js');
module.exports.suggestion = suggestion;
const { timestamp } = require('../../timestamp.js');



function suggestion(client, channel, user, suggestion){
    if ((suggestion.startsWith('"') || suggestion.startsWith("'")) && (suggestion.endsWith('"') || suggestion.endsWith("'"))){
        suggestion = suggestion.substring(1,suggestion.length-1);
    }
	try{
        client.channels.cache.get(vars.sBox).send(`Suggestion from: ${user} \n>>> ${suggestion}`) //send message to the staff suggestion box
            .catch(err => console.error(`${timestamp()} - Failed to send suggestion to staff box: ${err}`))
		channel.send({ embeds: [embed(user, suggestion)]}) //send message to the user
            .then(msg => setTimeout(function(){msg.delete()}, 1000*15))
			.catch(err => console.error(`${timestamp()} - User Suggestion embed failed to send: ${err}`));
	} catch(err) {
		channel.send("Suggestion not logged for the following reason: " + err.message + "\n\n\
		This message will be displayed for 30 seconds. Please provide this error message to staff.")
            .then(msg => setTimeout(function(){msg.delete()}, 1000*30))
			.catch(err => console.error(`${timestamp()} - Suggestion Error Message failed to send: ${err}`));
	}
}

function embed(user, suggestion){
    let thisEmbed = new EmbedBuilder()
        .setTitle('__**Suggestion Box**__')
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .setDescription(`Your suggestion has been logged and will be reviewed by staff:\n\nsuggestion from: ${user}\n>>> ${suggestion}`)
    return thisEmbed
}