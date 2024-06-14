const { 
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder, 
    ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, 
    } = require('discord.js');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');

module.exports.roles = async function(subCommand,interaction,guild,member){
    switch(subCommand){
//add
        case "add":
            var validRoles = await cmd.listRoles(guild.id, member, 'count', 0) //rname, rid, gid
            var memRoles = member.roles.cache
            memRoles.forEach( m => {
                validRoles.forEach(r =>{
                    let index = validRoles.indexOf(r)
                    if(m.id == r.rid){
                        validRoles.splice(index,1)
                    }
                })
            })
            rCount = validRoles.length
            var menuCount = Math.ceil(rCount/25) //counts the number of menus needed
            var remainder = rCount % 25 //last menu will have this many items
            var comp = []
            validRoles.sort((a, b) => a.rName.toLowerCase() > b.rName.toLowerCase() ? 1 : -1); //sort our roles by name
            for (let i=0;i<menuCount;i++){
                var menuRow = new ActionRowBuilder()
                var menu = new StringSelectMenuBuilder()
                    .setCustomId(`menu${i}`)
                    .setPlaceholder('Make a selection')
                if(i<menuCount-1){//not last menu
                    for(let x=0;x<25;x++){
                        menu.addOptions(
                            new StringSelectMenuOptionBuilder()
        .setLabel(validRoles[x+(25*i)].rName) //25*i adds the number of menus we've iterated through
        .setValue(validRoles[x+(25*i)].rid)
                        )
                    }
                } else { //last menu has less items
                    for(let x=0;x<remainder;x++){
                        menu.addOptions(
                            new StringSelectMenuOptionBuilder()
        .setLabel(validRoles[x+(25*(menuCount-1))].rName)
        .setValue(validRoles[x+(25*(menuCount-1))].rid)
                        )
                    }
                }
                menuRow.addComponents(menu)
                comp.push(menuRow)
            }
            var okButton = new ButtonBuilder()
                .setCustomId('okButton')
                .setLabel('OK')
                .setStyle(ButtonStyle.Primary)
            var cancelButton = new ButtonBuilder()
                .setCustomId('cancelButton')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
            var buttonRow = new ActionRowBuilder()
                .setComponents(okButton,cancelButton)
            comp.push(buttonRow)
            var rmAddResponse = await interaction.reply({
                content: "Please select the roles you would like to add yourself to.", 
                components: comp, ephemeral: true
            })
            
            var buttonCollector = rmAddResponse.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120_000
            })
            var menuCollector = rmAddResponse.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 120_000
            })
            var selection = [] //list of selected roles
            menuCollector.on('collect', async resp => {
                var role = guild.roles.cache.get(resp.values[0])
                if(role){
                    var check = selection.indexOf(role)
                    if(check > -1){ //role is in the selection index
                        selection.splice(check,1)
                    } else {
                        selection.push(role)
                    }
                }
                var list = ""
                selection.forEach(r => {list+=`${r.name}\n`})
                resp.update({content: `${list}----------------\nInput Recieved, Select a role again to remove it from the list.  Press OK to save.`})
            })
            buttonCollector.on('collect', async resp => {
                menuCollector.stop()
                buttonCollector.stop()
                if(resp.customId == 'okButton'){
                    var myRoles = await cmd.addRole(guild,member,selection,interaction)//define values please.
                    //interaction.editReply({content: myRoles, components: []})
                } else {
                    interaction.editReply({content: "All Actions Canceled", components:[]})
                }
            })
        break;
//remove
        case "remove":
            var roles = await cmd.listRoles(guild.id, member, 'count', 0) //rname, rid, gid
            var validRoles = []
            var memRoles = member.roles.cache
            memRoles.forEach( m => {
                roles.forEach(r =>{
                    if(m.id == r.rid){
                        validRoles.push(m)
                    }
                })
            })
            rCount = validRoles.length
            var menuCount = Math.ceil(rCount/25) //counts the number of menus needed
            var remainder = rCount % 25 //last menu will have this many items
            var comp = []
            validRoles.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1); //sort our roles by name
            for (let i=0;i<menuCount;i++){
                var menuRow = new ActionRowBuilder()
                var menu = new StringSelectMenuBuilder()
                    .setCustomId(`menu${i}`)
                    .setPlaceholder('Make a selection')
                if(i<menuCount-1){//not last menu
                    for(let x=0;x<25;x++){
                        menu.addOptions(
                            new StringSelectMenuOptionBuilder()
        .setLabel(validRoles[x+(25*i)].name) //25*i adds the number of menus we've iterated through
        .setValue(validRoles[x+(25*i)].id)
                        )
                    }
                } else { //last menu has less items
                    for(let x=0;x<remainder;x++){
                        menu.addOptions(
                            new StringSelectMenuOptionBuilder()
        .setLabel(validRoles[x+(25*(menuCount-1))].name)
        .setValue(validRoles[x+(25*(menuCount-1))].id)
                        )
                    }
                }
                menuRow.addComponents(menu)
                comp.push(menuRow)
            }
            var okButton = new ButtonBuilder()
                .setCustomId('okButton')
                .setLabel('OK')
                .setStyle(ButtonStyle.Primary)
            var cancelButton = new ButtonBuilder()
                .setCustomId('cancelButton')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
            var buttonRow = new ActionRowBuilder()
                .setComponents(okButton,cancelButton)
            comp.push(buttonRow)
            var rmAddResponse = await interaction.reply({
                content: "Please select the roles you would like to remove yourself from.", 
                components: comp, ephemeral: true
            })
            
            var buttonCollector = rmAddResponse.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120_000
            })
            var menuCollector = rmAddResponse.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 120_000
            })
            var selection = [] //list of selected roles
            menuCollector.on('collect', async resp => {
                var role = guild.roles.cache.get(resp.values[0])
                if(role){
                    var check = selection.indexOf(role)
                    if(check > -1){ //role is in the selection index
                        selection.splice(check,1)
                    } else {
                        selection.push(role)
                    }
                }
                var list = ""
                selection.forEach(r => {list+=`${r.name}\n`})
                resp.update({content: `${list}----------------\nInput Recieved, Select a role again to remove it from the list.  Press OK to save.`})
            })
            buttonCollector.on('collect', async resp => {
                menuCollector.stop()
                buttonCollector.stop()
                if(resp.customId == 'okButton'){
                    var myRoles = await cmd.removeRole(guild,member,selection,interaction)//define values please.
                    //interaction.editReply({content: myRoles, components: []})
                } else {
                    interaction.editReply({content: "All Actions Canceled", components:[]})
                }
            })
        break;
//list
        case "list":
            var roles = await cmd.listRoles(guild.id, member, 'count', 0) //rname, rid, gid
            var validRoles = []
            var memRoles = member.roles.cache
            var output = ""
            memRoles.forEach( m => {
                roles.forEach(r =>{
                    if(m.id == r.rid){
                        validRoles.push(m)
                    }
                })
            })
            validRoles.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1); //sort our roles by name
            for (var v of validRoles){
                output+=`${v.name}\n`
            }
            interaction.reply({content: `You are currently a member of the following user assignable roles:\n\n${output}`, components: [], ephemeral: true})
        break;
        default:
            interaction.reply({
                content: "Suspicious data detected.  This incident has been logged",
                components: []
            })
            cmd.logger(guild, "Warning", `User: ${member.displayName} submitted an invalid subCommand for the /roles command: ${subCommand}`);
            console.error(`CRITICAL - ${timestamp()} - server: ${guild.name} - User: ${member.displayName} submitted an invalid subCommand for the /roles command: ${subCommand}`)
        break;
    }
}