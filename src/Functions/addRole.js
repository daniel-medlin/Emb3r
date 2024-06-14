const { timestamp } = require('../timestamp.js');
const cmd = require('../Commands/Commands.js');

module.exports.addRole = async function addRole(guild,member,values,interaction){ //sanity check to ensure the correct role is being added then add the role.
    //values.push('625074415574450196')
    const safe = await checkValues(guild, member, values)
    if(safe){
        const result = await assignRoles(guild, member, values)
        var roleList = result[0]
        var flagged = result[1]
        if (flagged){
            interaction.editReply({
                content: "Suspicious data detected.  This incident has been logged",
                components: []
            })
        } else {
            var roles = ""
            if(roleList.length>0){
                for(let i=0;i<roleList.length;i++){
                    roles+=`${roleList[i]}\n`
                }
            }
            interaction.editReply({
                content: `Your roles have been added:\n${roles}`,
                components: []
            })
        }
    } else {
        interaction.editReply({
            content: "Suspicious data detected.  This incident has been logged",
            components: []
        })
    }

}

async function checkValues(guild, member, values){
    var safe = true
    await values.forEach( async v => {
        if(!await cmd.listRoles(guild.id, member, "validate", v)){
            //console.log("not safe")
            safe = false
        }
    })
    return safe
}

async function assignRoles(guild, member, values){
    var flagged = false
    var roleList = []
    for ( var v of values){
        if(await cmd.listRoles(guild.id, member, "validate", v)){
            let role = member.guild.roles.cache.find(role => role.id === v.id)
            roleList.push(role.name)
            try {
                await member.roles.add(v)
            } catch (error) {
                console.error(`${timestamp()} - server: ${guild.name} - Failed to add role: ${role.name} to ${member.displayName}: ${error}`)
            }
        } else {
            //Somehow we got a role that wasn't on the list.  May be malicious intent here.
            let role = member.guild.roles.cache.find(role => role.id === v)
            flagged = true
            try { //if it's a valid role then put the role name in the log otherwise we'll show the input.
                cmd.logger(guild, "Warning", `User: ${member.displayName} submitted a role add request for unauthorized role: ${role.name}`);
                console.error(`CRITICAL - ${timestamp()} - server: ${guild.name} - User: ${member.displayName} submitted a role add request for unauthorized role: ${role.name}`)
            } catch (error) {
                cmd.logger(guild, "Warning", `User: ${member.displayName} submitted a role add request for unauthorized role: ${v}`);
                console.error(`CRITICAL - ${timestamp()} - server: ${guild.name} - User: ${member.displayName} submitted a role add request for unauthorized role: ${v}`)
            }
        }
    }
    return [roleList, flagged]
}