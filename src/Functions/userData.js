const fs = require('fs');
const { timestamp } = require("../../src/timestamp.js");
const fileName = "data/userData.json";

module.exports.deleteUser = deleteUser;

exports.storeNewUser = function storeNewUser(gid, uid, uname){ //Write users to .json
	const thisUserData = {gid: gid, uid: uid, uname: uname, joined: new Date()};
	var jsonStr = fs.readFileSync(fileName); //read in the json data
	var obj = JSON.parse(jsonStr); //parsed the json string for reading.
	var users = obj.users;
	let found = false;

	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			found = true;
		}
	}
	if (!found){
		obj['users'].push(thisUserData); //adds new users to the users object in obj
		jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
		fs.writeFileSync(fileName,jsonStr, function(err) {
			if (err) {
				console.error(timestamp() + " - " +err);
			}
		}); //write the new json file
	}
}

async function deleteUser(uid){ //remove users from .json
	let jsonData = fs.readFileSync(fileName)
	let users = JSON.parse(jsonData).users;
	
	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			users.splice(i,1);
			jsonData = JSON.stringify({"users":users});
			await fs.writeFileSync(fileName, jsonData, function(err) {
				if (err) {
					console.error(timestamp() + " - " +err);
				}
			});
		}
	}

}
exports.checkUsers = async function checkUsers(client){ //hourly, check members of the new users group.  Compare that list of users to the users we have in the .json file.  Anyone older than 24 hours kick
	setInterval(async function(){
		//console.log("Checking for expired users - " + Date());
		let now = new Date();
		var jsonData = fs.readFileSync(fileName)
		var users = JSON.parse(jsonData).users;

        for (let a=0;a<users.length;a++){ //loop through users array 
            const thisGuild = client.guilds.cache.get(users[a].gid);
            const gMembers = thisGuild.roles.cache.find(r => r.name === 'Member' || r.name === 'Members').id //members of the member role
            if(gMembers.includes(users[a].id)){
                deleteUser(users[a].id) //a member on the list is a member in the guild. Maybe a mod made them member?
            } else {
                if(thisGuild.members.cache.get(users[a].uid)){ //if the member on the list is in the guild..
                    const gid = users[a].gid
                    const uid = users[a].uid;
                    const name = users[a].uname;
                    const join = new Date(users[a].joined)
                    const diffDay = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60 * 60 * 24); //Calculate the difference in days. if >= 1 then kick.
                    //const diffDay = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60); //Calculate the difference in min.  useful for testing.
                    if (diffDay >= 1){
                        await thisGuild.members.cache.get(uid).kick("Failed to accept the rules within 24 hours of joining");
                        deleteUser(uid);
                        console.log(`${name} has been kicked for inactivity - ${timestamp()}`);
                    }  
                } else { deleteUser(users[a].uid) }//user has left server
                
            }
            
        }
	}, 1000*60*60);//run every hour
	//}, 1000*10);//run every 10 sec for faster testing.
}
