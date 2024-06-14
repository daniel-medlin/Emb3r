const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp')
const cmd = require('../src/Commands/Commands.js')

module.exports = {
    name: Events.GuildMemberRemove,
    execute(member) {
        cmd.deleteUser(member.user.id)
        console.log(`${timestamp()} - server: ${member.guild.name} - ${member.displayName} has left ${member.guild.name}.`)
    }        
};