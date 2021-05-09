const Discord = require(`discord.js`);
const {green, red} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
    name: 'song',
    aliases: [`now`, 'np', `nowplay`, `nowplaying`, `current`],
    display: true,
	description: 'Shows what track is currently playing',
	async execute(message, args, servers) {
        var server = func.getServer(message, servers);
		
        if(server && server.queue.length > 0) {
            func.nowPlaying(message, server);
        }
        else {
            return func.sendMessage(`No track is currently playing`, message.channel, red);
        }
	},
};
