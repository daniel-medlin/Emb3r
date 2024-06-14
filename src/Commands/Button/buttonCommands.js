const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder, StringSelectMenuComponent, ComponentType } = require('discord.js');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');
//TODO Continue work on add and remove (needs logging and cleanup)
//Build admin function to add/remove roles from the list
module.exports.command = async function slash(interaction){
    const member = interaction.member;
    const client = interaction.client;
    const guild  = interaction.guild;
    const options = interaction.options;
    const id = interaction.customId;
    const buttonAdd = new ButtonBuilder()
        .setCustomId("addRoles")
        .setLabel("Add Roles")
        .setStyle(ButtonStyle.Primary)
    const buttonRemove = new ButtonBuilder()
        .setCustomId("removeRoles")
        .setLabel("Remove Roles")
        .setStyle(ButtonStyle.Danger)
    const buttonCancel = new ButtonBuilder()
        .setCustomId("close")
        .setLabel("Close")
        .setStyle(ButtonStyle.Secondary)
    const row2 = new ActionRowBuilder()
        .addComponents(
            buttonAdd,
            buttonRemove,
            buttonCancel
    )    
    switch(id){
        case 'userRoles':

            await interaction.update({
                content: "Please Select an action",
                components: [row2]
            })
        break;
        case 'addRoles':
            var rMenu = await gatherRoles(guild.id, member, "add")
            if(rMenu != false){
                const dataRow = new ActionRowBuilder()
                        .addComponents(
                            rMenu               
                        );
                const cancelRow = new ActionRowBuilder()
                        .addComponents(
                            buttonCancel
                        );
                const response = await interaction.update({
                    content: "Adding Roles",
                    components: [
                        dataRow,
                        cancelRow
                    ]
                })
                const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60_000 })
                collector.on('collect', async i => {
//addRole Call
                    await cmd.addRole(guild,member,i,interaction)
                })
            } else {
                await interaction.update({
                    content: "Unfortunately, we don't have any roles available for you to pick from.",
                    components: []
                })
            }
            
            //addRole(guild,member,rid,rName)
        break;
        case 'removeRoles':
            var rMenu = await gatherRoles(guild.id, member, "remove")
            if(rMenu != false){
                const dataRow = new ActionRowBuilder()
                            .addComponents(
                                rMenu               
                            );
                    const cancelRow = new ActionRowBuilder()
                            .addComponents(
                                buttonCancel
                            );
                    const response = await interaction.update({
                        content: "Removing Roles",
                        components: [
                            dataRow,
                            cancelRow
                        ]
                    })
                    const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60_000 })
                    collector.on('collect', async i => {
    //removeRole Call
                        await cmd.removeRole(guild,member,i,interaction)
                    })
                } else {
                    await interaction.update({
                        content: "Unfortunately, we don't have any roles available for you to pick from.",
                        components: []
                    })
                }
        break;
        case 'close':
            await interaction.update({
                content: "Menu Closed",
                components:[]
            })
        default: return;
    }
}

async function gatherRoles(gid, member, action){
    const myRoles = await cmd.listRoles(gid, member, action)
    if(myRoles.length > 0){
        var rMenu = new StringSelectMenuBuilder()
            .setCustomId('userRoles')
            .setPlaceholder('Select your roles')
            .setMinValues(1)
            .setMaxValues(myRoles.length);
        (myRoles).forEach(r => {
            if(r.rName){
                rMenu.addOptions(
                    new StringSelectMenuOptionBuilder()
                    .setLabel(r.rName)
                    //.setDescription(r.rName)
                    .setValue(r.rid)
                )
            }
            
        });
        return rMenu;
    } else {
        return false;
    }
}