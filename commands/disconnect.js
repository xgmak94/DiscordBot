const {red} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
	name: 'disconnect',
	aliases: [`disc`, `dis`, `dc`, `leave`],
	display: true,
	description: 'Disconnect the bot from the voice channel',
	async execute(message, args, servers) {
		var server = func.getServer(message, servers);
				
		if(message.guild.me.voice.channel) {
			message.guild.me.voice.channel.leave();
			message.react(`👍`);
		}
		else {
			return func.sendMessage(`Not connected to a voice channel`, message.channel, red);
		}
	},
};