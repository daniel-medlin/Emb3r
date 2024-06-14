const { EmbedBuilder, Embed } = require('discord.js');
const vars = require('../../../config/config.json');

module.exports.serverStats = serverStats;
module.exports.userStats = userStats;

async function serverStats(guild){
    let server = guild.name;
	let d = guild.createdAt.toDateString();
	let numUsers = guild.memberCount;
    let guildMembers = await guild.members.fetch({ withPresences: true });
    let online = await guildMembers.filter(m => !m.user.bot && (m.presence?.status == 'online' || m.presence?.status == 'dnd' || m.presence?.status == 'idle')).size //I guess 'offline' is no longer a thing.  Reading the documentation would have sped up this process a little bit...
	let channels = guild.channels.cache
    let chanCount = channels.filter(c => c.type != 4 && c.type != 11).size; //type 4 is categories. 
	let forumCount = channels.filter(c => c.type === 11).size;// type 11 is forums
    let catCount = channels.filter(c => c.type === 4).size;
	let roleCount = guild.roles.cache.size - 1; //don't count @everyone

	let createdString = "This server was started on " + d;
    let channelStat = `There are ${chanCount} channels and ${forumCount} forum posts in ${catCount} categories.`
	let userStat = "Number of online users: " + online + "/" + numUsers;
	let roles = "Total number of roles: " + roleCount;
    const serverEmbed = new EmbedBuilder()
        .setDescription(`__**${server} Stats**__`)
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
        .addFields([
            { name: '\u200b',                   value: '\u200b'},
            { name: `${server} Launch Date`,  value: createdString },
            { name: '\u200b',                   value: '\u200b' },
            { name: 'User count',               value: userStat },
            { name: 'Roles',                    value: roles },
            { name: 'Channels',                 value: channelStat}
        ]);
        return(serverEmbed);
}

function userStats(u, guild){
    let server = guild.name;
    let user = guild.members.cache.get(u.id)
	let uIcon = u.displayAvatarURL(); //user avatar
    //Time on Server
    var timeOutput;
    var joinDate = user.joinedAt;
    var curTime = Date.now();
    var dif = ((curTime - joinDate)/3600000); //this is all that matters for calculating 24 hours but I want to make it display nicely.
    var timeOutput = prettyDate(dif)
    const memberEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(uIcon)
        .addFields([
            { name:'__**Member Information**__', value:'\u200b' },
            { name: 'Display Name', value: user.displayName},
            { name: 'Username', value: u.tag},
            { name: 'ID', value: u.id },
            { name: '\u200b', value:'\u200b'},
            { name: 'Discord member since:', value: `${u.createdAt}`},
            { name: `${server} member since:`, value: `${joinDate}` },
            { name: 'Time since Join', value: timeOutput },
            { name: '\u200b', value: '\u200b' },
            { name: 'Role List', value: roleMap(user)},

        ])
        return(memberEmbed)
}

function prettyDate(dif){
    var hour = Math.floor(dif);
    var min = Math.floor((dif - hour)*60);
    if (hour > 24){
        var day = Math.floor(hour/24)
        var hour = hour % 24 //remainder of hours
    } else day = 0
    var dayVal, hourVal, minVal;
    if (day == 1){dayVal = "day";} else dayVal = "days";
    if (hour == 1){hourVal = "hour";} else hourVal = "hours";
    if (min == 1){minVal = "min";} else minVal = "mins";
    if (day < 365){
       return (day + " " + dayVal + ", " + hour + " " + hourVal + ", " + min + " " + minVal)
    } else {
        var year = Math.floor(day/365)
        day = day % 365
        if (day == 1){dayVal = "day";} else dayVal = "days";
        if (year > 1){var yearVal = 'years';} else yearval = 'year';
       return(`${year} ${yearVal}, ${day} ${dayVal}, ${hour} ${hourVal}, ${min} ${minVal}`)
    }
}

function roleMap(user){
    let rolemap = user.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => r)
        .join(",");
        if (rolemap.length > 1024) rolemap = "Too many roles to display";
        if (!rolemap) rolemap = "No roles";
        rolemap = rolemap.replace(',@everyone,', '')
        rolemap = rolemap.replace(',@everyone','')//ok I couldn't figure out the right way to do it so string substitution it is...
        return rolemap
}