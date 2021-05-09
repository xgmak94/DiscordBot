const {red, green} = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
    name: 'repeat',
    aliases: [`loop`],
    display: true,
	description: 'Repeat the current track',
	async execute(message, args, servers) {
        var server = func.getServer(message, servers);

        server.repeat = !server.repeat; //false by default
        if(server.repeat) {
            return func.sendMessage(`Repeat is \`ENABLED\``, message.channel, green);
        }
        else {
            return func.sendMessage(`Repeat is \`DISABLED\``, message.channel, red);
        }
	},
}