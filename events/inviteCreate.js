const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp')
const { guildInvites } = require('../bot.js')

//catching invites: https://stackoverflow.com/questions/69521374/discord-js-v13-invite-tracker
module.exports = {
    name: Events.InviteCreate,
    async execute(invite) {
        console.log(`${timestamp()} - server: ${invite.guild.name} - New invite created:\nServer: ${invite.guild.name}\nUser: ${invite.inviter.username}\nChannel: ${invite.channel.name}\nCode: ${invite.code} `)
	    const invites = await invite.guild.invites.fetch();
	    const codeUses = new Map();
	    invites.each(inv => codeUses.set(inv.code, inv.uses));
	    guildInvites.set(invite.guild.id, codeUses);
    }        
};