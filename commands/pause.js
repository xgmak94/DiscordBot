const {yellow, red} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
	name: 'pause',
	aliases: [`stop`, `p`],
	display: true,
	description: 'Pauses the currently playing track',
	execute(message, args, servers) {
		var server = func.getServer(message, servers);
				
        if(server && server.dispatcher && !server.dispatcher.paused) {
			server.dispatcher.pause();
			return func.sendMessage(`Paused`, message.channel, yellow);
		}
		else {
			return func.sendMessage(`Nothing to pause`, message.channel, red);
		}
	},
};