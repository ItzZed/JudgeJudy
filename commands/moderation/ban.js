const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {

	name: "ban",
	category: "moderation",
	description: "Bans the member",
	usage: "<id | mention>",
	run: async (client, message, args) =>  {

		const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

		const timeToDeleteMessage = 10000; // FOR DEBUGGING ITS AT 10S (10000MS) // Prolly make it 5s (5000ms)

		if(message.deletable) message.delete();

		// No Mention ¯\_(ツ)_/¯
		if(!args[0]) {

			// Reply's ban command without mention and then deletes message after timeToDeleteMessage
			return message.reply("Please provide a person to ban")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Reason  ¯\_(ツ)_/¯
		if(!args[1]) {

			// Reply's ban command without reason and then deletes message.
			return message.reply("Please provide a reason to ban")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Ban/Author Perms XD  (nice try bud)
		if(!message.member.hasPermission("BAN_MEMBERS")) {

			return message.reply("❌ You Do Not Have The Permission To Ban Members!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// No Bot Perms (bruh why would you mod bot without giving it perms xD)
		if(!message.guild.me.hasPermission("BAN_MEMBERS")) {

			return message.reply("❌ I Do Not Have The Permissions To Ban Members!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		// No Member Found 😑
		if(!toBan) {

			return message.reply("Couldn't Find That Member, Try Again!")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// Why Do You Wanna Ban Yourself?
		if(message.author.id === toBan.id) {

			return message.reply("You Can't Ban Yourself... why are you trying to ban yourself?")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		// Can I Even Ban Them?
		if(!toBan.bannable) {

			return message.reply("I cannot ban the member, most likely due to the role hierarchy")
				.then(m => m.delete({ timeout: timeToDeleteMessage }));

		}

		const embed = new MessageEmbed()
			.setColor("#ff0000")
			.setThumbnail(toBan.user.displayAvatarURL())
			.setFooter(message.member.displayName, message.author.displayAvatarURL())
			.setTimestamp()
			.setDescription(stripIndents`**> Banned Member:** ${toBan} (${toBan.id})
			**> Banned By:** ${message.author} (${message.author.id})
			**> Reason:** ${args.slice(1).join(" ")}`);

		const promptEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setAuthor("This Verification Becomes Invalid After 30s")
			.setDescription(`Do you want to ban ${toBan}`);

		message.channel.send(promptEmbed).then(async msg => {

			const emoji = await promptMessage(msg, message.author, 30 , ["✅", "❌"]);

			if(emoji === "✅") {

				await msg.delete();

				toBan.ban({reason: args.slice(1).join(" ")})
					.catch(err => {
						if(err) return message.channel.send(`Well... somethings wrong!`);
					});
				logChannel.send(embed).then(r => r);

			}
			else if(emoji === "❌") {

				await msg.delete();

				message.reply("Ban Canceled!")
					.then(m => m.delete({ timeout: timeToDeleteMessage }));

			}

		});



	}


}