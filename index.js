const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Setup Command Files
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
["command"].forEach(handler =>{
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

// Login
client.login(token);


client.on("message", async message => {

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

	// If The Message Does Not Start With Prefix OR Not From A Bot, Return.
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	// Argument Handler
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();

	// Check If Command Given
	if(cmd.length === 0) return;


	let command = client.commands.get(cmd);

	// Check If Command Exists
	if(!command) {

		command= client.commands.get(client.aliases.get(cmd))

		return message.channel.send(`Unknown Command!`);

	}



	try {

		command.run(client, message, args);

	}
	catch(error) {

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