const { EmbedBuilder, Embed } = require('discord.js');
const vars = require('../../../config/config.json');

module.exports.ipStats = fetchData

async function fetchData(ip){
    try{
        if (!checkIP(ip)){return error()}; //validate the data return an error if found false.
        const response = await fetch(`https://freeipapi.com/api/json/${ip}`)
        const data = await response.json();
        if(data.cityName == ""){return error()};//verify actual data came in
        const city = data.cityName;
        const state = data.regionName; //region
        const zip = data.zipCode;
        const country = data.countryName;
        const countryCode = data.countryCode;
        const tz = data.timeZone;
        return buildEmbed(ip, city, state, zip, country, countryCode, tz)
    } catch(err){"Failed trying to access the website: https://freeipapi.com with the following error: ", err}
}

async function buildEmbed(ip, city, state, zip, country, countryCode, timezone){
    const ipstat = new EmbedBuilder()
        .setDescription(`__**IP Stats**__`)
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
        .addFields([
            { name: '\u200b',       value: '\u200b'},
            { name: `IP Address:`,  value: ip },
            { name: `City:`,        value: city },
            { name: `Region:`,      value: state },
            { name: 'Zip Code:',    value: zip },
            { name: `Country:`,     value: `${country} (${countryCode})` },
            { name: `Timezone:`,    value: `UTC ${timezone}`}
        ]);
            
    return(ipstat)
}

function error(){
    const errorEmbed = new EmbedBuilder()
        .setDescription(`__**ERROR**__`)
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
        .addFields([
            { name: 'You must submit an IP address',    value: '\u200b'}
        ]);

    return errorEmbed
}

function checkIP(input){
    var match = input.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    return match != null && match != "" &&
        match[1] <= 255 && match[2] <= 255 &&
        match[3] <= 255 && match[4] <= 255;
}