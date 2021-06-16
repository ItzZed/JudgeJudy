module.exports = {

	name: 'args-info',
	description: 'Info about the arguments',
	args: true,
	execute(message, args) {
		if (args[0] === 'megu') {
			return message.channel.send('min');
		}

		message.channel.send(`Arguments: ${args} \n Arguments Length: ${args.length}`);
	},
};