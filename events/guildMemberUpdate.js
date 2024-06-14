const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp')
const cmd = require('../src/Commands/Commands.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    execute(oldMember, newMember) {
        const guild = newMember.guild;
        const memberRole = newMember.guild.roles.cache.find(r => r.name === 'Member' || r.name === 'Members').id
        if (oldMember.pending && !newMember.pending){//user accepted the rules so pending switched to false
            try {
                newMember.roles.add(memberRole);
                cmd.deleteUser(newMember.id);
                cmd.logger(guild, "New Member", `${newMember.user} has accepted the rules and was assigned the Member role.`)
                console.log(`${timestamp()} - server: ${newMember.guild.name} - ${newMember.user.username} has accepted the rules and was assigned the Member role.`)
            } catch (error) {
                cmd.logger(guild, "Error", `Failed to give member role to user: ${newMember.user} - ${error}`)
                console.error(`${timestamp()} - server: ${newMember.guild.name} Failed to give member role to user: ${newMember.user.username} - ${error}`)
            }
        }
    }        
}