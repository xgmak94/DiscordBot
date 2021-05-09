const {green, red} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
	name: 'clear',
	aliases: [`clean`],
	display: true,
	description: 'Clears the queue except for the current song',
	async execute(message, args, servers) {
		var server = func.getServer(message, servers);
		
        if(server && server.dispatcher && server.queue.length > 1) {
			server.queue.splice(1, server.queue.length); //leave the current playing track
			return func.sendMessage(`Cleared queue`, message.channel, green);
		}
		else {
			return func.sendMessage(`No queue to clear`, message.channel, red);
		}
	},
};