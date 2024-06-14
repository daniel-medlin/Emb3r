const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp');
const { guildInvites } = require('../bot.js');
const invites = require('../config/inviteCodes.json');
const cmd = require('../src/Commands/Commands.js');

module.exports = {
    name: Events.GuildMemberAdd,
        async execute(member) {
            const guild = member.guild
            const cachedInvites = await guildInvites.get(member.guild.id);
            const newInvites = await member.guild.invites.fetch();
            const usedInvite = await newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
	    try{
                if(invites.inviteCodes.includes(usedInvite.code)){
                    //member.send(`Hi, ${member.user.username}, welcome to ${member.guild.name}! Library Key: ${invites.libraryKeys[0]}`)
                    cmd.logger(guild, "Icky code", `${member.user} joined with an icky code.`)
                }
            } catch (error){
                console.error(`${timestamp()} - server: ${member.guild.name} - Error on guildMemberAdd: ${error}`)
            }
            newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
            guildInvites.set(member.guild.id, cachedInvites);
        
            if(!member.user.bot){ //if new user isn't a bot then give the newUser role and add to the userData.json
                cmd.storeNewUser(guild.id, member.id, member.user.username)
                if (usedInvite !== undefined){
                    console.log(`${timestamp()} - server: ${member.guild.name} - type: USER - ${member.user.username} has joined ${member.guild.name} with the code: ${usedInvite.code}.`)
                } else {console.log(`${timestamp()} - server: ${member.guild.name} - type: USER - ${member.user.username} has joined ${member.guild.name} with unknown code.`)}
                } else {//user is a bot
                console.log(`${timestamp()} - server: ${member.guild.name} - type: BOT - ${member.user.username} has joined ${member.guild.name}.`)
            }
    }        
};
