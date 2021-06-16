const { getMember, formatDate } = require("../../functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags")

module.exports = {

	name: "whois",
	aliases: ["userinfo", "user", "who"],
	category: "info",
	description: "Returns User Information",
	usage: "whois [username | id | mention]",
	run: async (client, message, args) => {

		const member = getMember(message, args.join(" "));

		// Member Variables
		const joined = formatDate(member.joinedAt);
		const roles = member.roles.cache
			.filter(r => r.id !== message.guild.id)
			.map(r => r)
			.join(", ") || "none";

		// User Variables
		const created = formatDate(member.user.createdAt);

		const embed = new MessageEmbed()
			.setFooter(member.displayName, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)

			.addField('Member Information', stripIndents`**> Display name:** ${member.display}
			**> Joined at:** ${joined}
			**> Roles:** ${roles}`, true)

			.addField(`User Information`, stripIndents`**> ID:** ${member.user.id}
			**> Username:** ${member.user.username}
			**> Discord Tag:** ${member.user.tag}
			**> Created at:** ${created}`, true)

			.setTimestamp()

		if(member.user.presence.game)
			embed.add('Current Playing', `**> Name:** ${member.user.presence.game.name}`);

		message.channel.send(embed);

	}

}