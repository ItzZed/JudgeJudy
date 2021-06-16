module.exports = {
	name: "ping",
	category: "info",
	description: "Returns Latency and API Ping",
	run: async (client, message, args) => {

		const msg = await message.channel.send("🏓 Pinging....");

		msg.edit(`🏓 Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);

	}

}