const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp')
const cmd = require('../src/Commands/Commands.js');
const slash = require('../src/Commands/Slash/slashCommands.js');
const button = require('../src/Commands/Button/buttonCommands.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        switch(interaction.type){
            case 2: //slash command
                slash.command(interaction);
            break;
            case 3: //Button or select menu
                button.command(interaction);
            break;
            default: return;
        }
    }        
}