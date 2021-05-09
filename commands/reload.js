module.exports = {
	name: 'reload',
    description: 'Reloads a command without restarting the bot',
    display: false,
	async execute(message, args, servers) {
        if(!args[0]) return;

        var commandName = args[0].toLowerCase();
        var command = message.client.commands.get(commandName) ||
                        message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\``);
        delete require.cache[require.resolve(`./${command.name}.js`)];
        
        try {
            var newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch(error) {
            console.error(error);
        }
	},
};