const { 
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder, 
    ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, 
    } = require('discord.js');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');

module.exports.roleManager = async function (subCommand, interaction, guild, member){
    switch (subCommand){ //add, remove, or list
//ADD
        case "add": //roleSelector
            var guildRoles = guild.roles
            var validRoles = []
            guildRoles.cache.forEach(role => { //iterate through each role in the server
                if(role.editable && role.name != '@everyone'){ //ignore @everyone and uneditable roles (bots and admin)
                    validRoles.push(role)
                }
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
                content: "Please select the roles you would like to make user assignable with the /role command.", 
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
                if(resp.customId == 'okButton'){//Fix roleManager.addRole
                    var myRoles = await cmd.storeRole(selection, guild, member)
                    interaction.editReply({content: myRoles, components: []})
                } else {
                    interaction.editReply({content: "All Actions Canceled", components:[]})
                }
            })
        break;
//REMOVE
        case "remove": //listSelector
            var validRoles = await cmd.listRoles(guild.id, member, 'count', 0)
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
                content: "Please select the roles you would like to remove from the user assignable list.", 
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
                } else {
                    let dead = validRoles.find(role => role.rid == resp.values[0])
                    var deadRole = {name: dead.rName, id: dead.rid, gid: dead.gid}
                    selection.push(deadRole)
                }
                var list = ""
                selection.forEach(r => {list+=`${r.name}\n`})
                resp.update({content: `${list}----------------\nInput Recieved, Select a role again to remove it from the list.  Press OK to save.`})
            })
            buttonCollector.on('collect', async resp => {
                menuCollector.stop()
                buttonCollector.stop()
                if(resp.customId == 'okButton'){
                    var myRoles = await cmd.deleteRole(selection, guild, member)
                    interaction.editReply({content: myRoles, components: []})
                } else {
                    interaction.editReply({content: "All Actions Canceled", components:[]})
                }
            })
        break;
        case "list":
            var roles = await cmd.listRoles(guild.id, member, 'count', 0)
            list = ""
            roles.forEach(r => {
                list+=`${r.rName}\n`
            });
            if(roles.length){
                await interaction.reply({content: `User Assignable Roles:\n\n${list}`, ephemeral: true})
            } else {
                await interaction.reply({content: "User Assignable Roles:\n\nNo Roles Selected", ephemeral: true})
            }
        break;
        default: await interaction.reply({content: "Invalid selection.  What did you do?", ephemeral: true });
    }
}