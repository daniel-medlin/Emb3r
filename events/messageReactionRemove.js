const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp.js')
const vars = require('../config/config.json')
const { client }= require('../bot.js')

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user) {
        if (reaction.partial){
            //if the message this reaction belongs to was removed, the fetching might result in an api error
            try{
                await reaction.fetch();
            } catch (error) {
                console.error(`${timestamp()} - Something went wrong when fetching the message`, error)
                return; //'reaction.message.author' may be undefined
            }
        } //message should be cached now
        if (reaction.message.id == vars.msgRoles){
            const react = reaction.emoji.name
            switch(react){
                case '🌱':
                    await removeRole(reaction, user, 'Novice 🌱')
                break;
                case '🔧':
                    await removeRole(reaction, user, 'Enthusiast 🔧')
                break;
                case '🛠️':
                    await removeRole(reaction, user, 'Intermediate 🛠️')
                break;
                case '🚀':
                    await removeRole(reaction, user, 'Advanced 🚀')
                break;
                case '🏆':
                    //await removeRole(reaction, user, 'Expert 🏆')
                break
                default: return;
            }
        }
    }
};

async function removeRole(reaction, user, roleName){
    guild = client.guilds.cache.get(reaction.message.guild.id) //guild object
    member = guild.members.cache.get(user.id) //member object
    role = guild.roles.cache.find(r => r.name === roleName) //role object
    try{
        await member.roles.remove(role)
    } catch(error){
        console.error(`${timestamp()} - Failed to add reaction role with the following error: `, error)
        return;
    }
    
}
