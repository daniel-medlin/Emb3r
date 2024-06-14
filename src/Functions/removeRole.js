const { timestamp } = require('../timestamp.js');
const cmd = require('../Commands/Commands.js');

module.exports.removeRole = async function removeRole(guild,member,values,interaction){ //sanity check to ensure the correct role is being added then add the role.
    //values.push('663826740111605810d')
    var flagged = false
    var roleList = ""
    for(var v of values){
        if(await cmd.listRoles(guild.id, member, "validate", v)){
            let role = member.guild.roles.cache.find(role => role.id === v)
            if(member.roles.cache.find(role => role.id == v)){
                var errorFound = false
                try {
                    await member.roles.remove(v)
                } catch (error) {
                    errorFound = true
                    console.error(`${timestamp()} - server: ${guild.name} - Failed to remove role: ${role.name} from ${member.displayName}: ${error}`)
                }
                if(!errorFound){roleList+=`${v.name}\n`}
            }
        } else {
            //Somehow we got a role that wasn't on the list.  May be malicious intent here.
            flagged = true
            try {
                cmd.logger(guild, "Warning", `User: ${member.displayName} submitted a role remove request for unauthorized role: ${role.name}`);
                console.error(`CRITICAL - ${timestamp()} - server: ${guild.name} - User: ${member.displayName} submitted a role remove request for unauthorized role: ${role.name}`)
            } catch (error) {
                cmd.logger(guild, "Warning", `User: ${member.displayName} submitted a role remove request for unauthorized role: ${v}`);
                console.error(`CRITICAL - ${timestamp()} - server: ${guild.name} - User: ${member.displayName} submitted a role remove request for unauthorized role: ${v}`)                
            }
            interaction.editReply({
                content: "Suspicious data detected.  This incident has been logged",
                components: []
            })
            return
        }
    }
    await interaction.editReply({
        content: `Your roles have been removed:\n${roleList}`,
        components: []
    })
}