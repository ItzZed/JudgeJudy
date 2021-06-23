const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");

module.exports = {

	name: "report",
	category: "moderation",
	description: "Report a member",
	usage: "<mention | id>",
	run: async (client, message, args) => {

		// If the bot can delete the message, do so
		if (message.deletable)
			message.delete();

		// Either a mention or ID
		let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		// No person found
		if (!rMember)
			return message.reply("Couldn't find that person?").then(m => m.delete({ timeout: 5000 }));

		// The member has BAN_MEMBERS or is a bot
		if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
			return message.reply("Can't report that member").then(m => m.delete({ timeout: 5000 }));

		// If there's no argument
		if (!args[1])
			return message.reply("Please provide a reason for the report").then(m => m.delete({ timeout: 5000 }));

		const channel = client.channels.cache.find(channel => channel.name === "reports");

		// No channel found
		if (!channel)
			return message.reply("Couldn't find a `#reports` channel").then(m => m.delete({ timeout: 5000 }));

		const embed = new MessageEmbed()
			.setColor("#ff0000")
			.setTimestamp()
			.setFooter(message.guild.name, message.guild.iconURL)
			.setAuthor("Reported member", rMember.user.displayAvatarURL())
			.setDescription(stripIndents`**> Member:** ${rMember} (${rMember.user.id})
            **> Reported by:** ${message.member}
            **> Reported in:** ${message.channel}
            **> Reason:** ${args.slice(1).join(" ")}`);

		return channel.send(embed);

	}

}
