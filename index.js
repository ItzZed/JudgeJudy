const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Setup Command Files
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
["command"].forEach(handle =>{
	require(`./handler/${handler}`)(client);
});


// Setup Config File
const {prefix, token, bot_info} = require("./config.json");

client.once("ready", () => {

	console.log("Ready!");
	console.log("Prefix is " + prefix);
	console.log("Name: " + bot_info.name);
	console.log("Version: " + bot_info.version);

	client.user.setPresence({

		status: "online",
		game: {
			name: "Being Developed!",
			type: "WATCHING"
		}
	});
});

client.login(token);

// Error Handler
function catchErr(err, message) {

	client.users.cache.get("222837998641872899").send("There was an error at channel: " + message.channel + " in guild " + message.guild);
	client.users.cache.get("222837998641872899").send("ERROR ```" + err + "```");
}

for(const file of commandFiles) {

	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);

}

client.on("message", message => {

	/*if(message.content === `${prefix}name`) {

		message.channel.send(message.guild.name);

	}
	else if(message.content === `${prefix}members`) {

		message.channel.send(`Total Members: ${message.guild.memberCount}`);

	}
	else if(message.content === `${prefix}me`) {

		message.channel.send(`Username: ${message.author.username}`);
		message.channel.send(`ID: ${message.author.id}`);

	}*/

	// If The Message Does Not Start With OR Not From A Bot, Return.
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	// Argument Handler
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Check If Command Exists
	if(!client.commands.has(commandName)) {

		return message.channel.send(`Unknown Command!`);

	}

	const command = client.commands.get(commandName);

	if (!args.length) {

		return message.channel.send(`You have not input any arguments, ${message.author}~`);

	}

	try {

		command.execute(message, args);

	}
	catch(error) {

		catchErr();
		console.error(error);
		message.reply("There was an issue executing that command!");

	}

	/*// Command ~Args
	if(command === "args") {

		// Check If No Args
		if (!args.length) {

			return message.channel.send(`You have not input any arguments, ${message.author}~`);

		}
		else if(args[0] === 'sage') {

			return message.channel.send('WALL');

		}

		message.channel.send(`Command Name: ${command}\nArguments: ${args}`);

	}
	//Command ~Ban
	else if(args[0] === "ban") {

		const taggedUser = message.mentions.users.first();
		message.channel.send(`You want to ban: ${taggedUser.username}, ID: ${taggedUser.id}`);

		return;

	}*/


});