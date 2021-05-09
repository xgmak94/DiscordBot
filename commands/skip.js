const {green, red} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
	name: 'skip',
	aliases: [`next`, `n`],
	display: true,
	description: 'Skips the currently playing track',
	async execute(message, args, servers) {
		var server = func.getServer(message, servers);
				
        if(server && server.queue.length > 0) {
			if(server.dispatcher) server.dispatcher.end();
			return func.sendMessage(`Skipping song`, message.channel, green);
		}
		else {
			return func.sendMessage(`No songs to skip`, message.channel, red);
		}
	},
};