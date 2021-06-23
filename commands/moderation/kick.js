const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promoteMessage } = require("../../functions.js");

module.exports = {

	name: "kick",
	category: "moderation",
	description: "Kicks the member",
	usage: "<id | mention>",
	run: async (client, message, args) =>  {

		const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

		const timeToDeleteMessage = 10000; // FOR DEBUGGING ITS AT 10S (10000MS) // Prolly make it 5s (5000ms)

		if(message.deletable) message.delete();

		// No Mention ¯\_(ツ)_/¯
		if(!args[0]) {

			// Replys kick command without mention and then deletes message after timeToDeleteMessage
			return message.reply("Please provide a person to kick")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Reason  ¯\_(ツ)_/¯
		if(!args[1]) {

			// Replys kick command without reason and then deletes message.
			return message.reply("Please provide a reason to kick")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Kick/Author Perms XD  (nice try bud)
		if(!message.member.hasPermission("KICK_MEMBERS")) {

			return message.reply("❌ You Do Not Have The Permission To Kick Members!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Bot Perms (bruh why would you mod bot without giving it perms xD)
		if(!message.guild.me.hasPermission("KICK_MEMBERS")) {

			return message.reply("❌ I Do Not Have The Permissions To Kick Members!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		const toKick = message.mentions.first() || message.guild.members.get(args[0]);

		// No Memeber Found 😑
		if(!toKick) {

			return message.reply("Couldn't Find That Member, Try Again!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// Why Do You Wanna Kick Yourself?
		if(message.author.id === toKick.id) {

			return message.reply("You Can't Kick Yourself... why are you trying to kick yourself?")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// Can I Even Kick Them?
		if(!toKick.kickable) {

			return message.reply("I cannot kick the member, most likely due to the role hierarchy")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		const embed = new MessageEmbed()
			.setColor("#ff0000")
			.setThumbnail(toKick.user.displayAvatarURL())
			.setFooter(message.member.displayName, message.author.displayAvatarURL())
			.setTimestamp()
			.setDescription(stripIndents`**> Kicked Member:** ${toKick} (${toKick.id})
			**> Kicked By:** ${message.author} (${message.author.id})
			**> Reason:** ${args.slice(1).join(" ")}`);

		const promptEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setAuthor("This Verification Becomes Invalid After 30s")
			.setDescription(`Do you want to kick ${toKick}`);

		message.channel.send(promptEmbed).then(async msg => {

			const emoji = await promptMessage(msg, message.author, 30 , ["✅", "❌"]);

			if(emoji === "✅") {

				msg.delete();

				toKick.kick(args.slice(1).join(" "))
					.catch(err => {
						if(err) return message.channel.send(`Well... somethings wrong!`);
					});
				logChannel.send(embed);

			}
			else if(emoji === "❌") {

				msg.delete();

				message.reply("Kick Canceled!")
					.then(m => m.delete({ timeout: timeToDeleteMessage }));

			}

		});



	}


}