module.exports = {
	name: "say",
	aliases: ["bc", "broadcast"],
	category: "moderation",
	description: "Says Your Input Via The Bot",
	usage: "<input>",
	run: async (client, message, args) => {

		// Deletes Bot Command
		if(message.deletable) message.delete();

		if(args.length < 1)
			return message.reply("Nothing to Say?").then(m => m.delete(5000));

		const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

		if(args[0].toLowerCase() === "embed") {

			const embed = new MessageEmbed()
				.setColor(roleColor)
				.setDescription(args.slice(1).join(" "))
				.setTimestamp()
				.setImage(client.user.displayAvatarURL())
				.setAuthor(message.author.name, message.author.displayAvatarURL())
				.setFooter(client.user.username, client .user.displayAvatarURL())

			message.channel.send(embed);

		}
		else {

			message.channel.send(args.join(" "));

		}

	}
}