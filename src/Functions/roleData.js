const fs = require('fs');
const { timestamp } = require("../../src/timestamp.js");
const fileName = "data/roleData.json";

exports.deleteRole = deleteRole
exports.storeRole = addRole
exports.listRoles = listRoles

async function addRole(roles, guild, member){ //Gets a list of roles and writes to json returns a string
	checkFile(fileName)
	var jsonStr = fs.readFileSync(fileName); //read in the json data
	var obj = JSON.parse(jsonStr); //parsed the json string for reading.
	var storedRoles = obj.roles; //roles already in the json
	roles.forEach(async role => {
		var notFound = true;
		var r = {rName: role.name, rid: role.id, gid: guild.id}
		for (let i=0;i<storedRoles.length;i++){ //check if the role is already stored
			if (storedRoles[i].rid == r.rid){
				notFound = false;
			}
		}
		if(notFound){ //role isn't already in the list
			obj['roles'].push(r); //adds new roles to the roles object in obj
			obj['roles'].sort((a, b) => a.rName.toLowerCase() > b.rName.toLowerCase() ? 1 : -1); //sort our roles by name
			jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
			await fs.writeFileSync(fileName,jsonStr, function(err) {
				if (err) {
					console.error(timestamp() + " - " +err);
				}
			}); //write the new json file
		}
	});
	var t = await listRoles(guild.id, member, 'count',0)
	var outText = ""
	t.forEach(r => {outText+=`${r.rName}\n`})
	return `New list of user selectable roles:\n\n${outText}`
}

async function deleteRole(roles, guild, member){  //Gets a list of roles and deletes from json returns a string
	checkFile(fileName)
	var jsonStr = fs.readFileSync(fileName); //read in the json data
	var obj = JSON.parse(jsonStr); //parsed the json string for reading.
	var storedRoles = obj.roles; //roles already in the json
	roles.forEach(async role => {
		var found = false;
		var index = -1;
		var r = {rName: role.name, rid: role.id, gid: guild.id}
		for (let i=0;i<storedRoles.length;i++){ //check if the role is already stored
			if (storedRoles[i].rid == r.rid){
				found = true;
				index = i
			}
		}
		if(found){ //role is in the list
			obj['roles'].splice(index,1)//remove roles from the roles object in obj
			obj['roles'].sort((a, b) => a.rName.toLowerCase() > b.rName.toLowerCase() ? 1 : -1); //sort our roles by name
			jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
			await fs.writeFileSync(fileName,jsonStr, function(err) {
				if (err) {
					console.error(timestamp() + " - " +err);
				}
			}); //write the new json file
		}
	});
	var t = await listRoles(guild.id, member, 'count',0)
	var outText = ""
	t.forEach(r => {outText+=`${r.rName}\n`})
	return `New list of user selectable roles:\n\n${outText}`
}

async function listRoles(gid,member,action,rid){ //returns a list of roles
	await checkFile(fileName)
	const jsonData = fs.readFileSync(fileName)
	const roles = JSON.parse(jsonData).roles; //Admin Supplied roles
	var output = []
	for (let i=0;i<roles.length;i++){ //loop through roles array.
		var obj = new Object();
        if(roles[i].gid == gid){ //Just show the current guild's data
			switch(action){
				case "add":
					if(member.roles.cache.get(roles[i].rid) == null){ //only show roles we don't have
						obj.rName = roles[i].rName;
						obj.rid = roles[i].rid;
						obj.gid = roles[i].gid;
					}
				break;
				case "remove":
					if(member.roles.cache.get(roles[i].rid)){ //only show roles we have
						obj.rName = roles[i].rName;
						obj.rid = roles[i].rid;
						obj.gid = roles[i].gid;
					}
				break;
				case "validate": //return true if the role is in the list
					if(roles[i].rid == rid){
						return true;
					}
				break;
				case "count": //just count the roles on the json
						obj.rName = roles[i].rName;
						obj.rid = roles[i].rid;
						obj.gid = roles[i].gid;
				break;
				default:
						return false;
			}
			if(obj.rName != null){
				output.push(obj)
			}
		}
    }
	if(action == "validate"){return false;}//we verified in the loop the rid wasn't present on the list.
	return output; //array of objects with values for rName, rID, and gID
}

async function checkFile(file){ //builds a blank roledata the first time this is run
	const buildStr = '{"roles":[]}'
	try {
		fs.readFileSync(file)
	} catch (error) {
		fs.writeFileSync(file, buildStr, function(err){if(err){console.error(`${timestamp()} - Failed to write roleData.json ${err}`)}})
	}			
	return
}