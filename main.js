const fs = require('fs');
const Discord = require('discord.js')
const {prefix, token, cd, red} = require('./config.json');
const func = require(`./commands/functions.js`);

var servers = new Discord.Collection();
var cooldown = new Discord.Collection();
var client = new Discord.Client();

setClientCommands(client);
setClientListeners(client);

client.login(token);

function setClientListeners(client) {
    client.on('shardReconnecting', id => {
        console.log(`Shard with ID ${id} reconnected.`)
    });
    
    client.on('shardDisconnect', (event, shardID) => {
        console.log(`Disconnected ${shardID}`);
    });

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}! (id ${client.user.id})`);
    });

    client.on('message', async message => {
        //IGNORE
        if(!message.guild || //if it is a DM?
            !message.content.startsWith(prefix) || //does not start with our prefix
            message.author.bot) return; //sent from another bot

        const args = message.content.slice(prefix.length).split(/ +/);
        console.log(args);

        const commandName = args.shift(); //strips command name from args
        const command = client.commands.get(commandName.toLowerCase()) || 
                            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase())); //find alias names

        if (!command) {
            return func.sendMessage(`Command ${prefix}${commandName} does not exist`, message.channel, red);
        }

        var time = Date.now();
        if(cooldown.get(message.author.id) && time - (cd*1000) < cooldown.get(message.author.id)) { //prevents 1 man spam
            return func.sendMessage(`Please wait ${cd} seconds between commands`, message.channel, red);
        }
        cooldown.set(message.author.id, time); //record the time of the last message that went through for author

        try {
            command.execute(message, args, servers); //execute is the main method used in each command, args is stripped of the command name
        }
        catch(error) {
            console.error();
            console.log(`Something went wrong with executing ${commandName}`);
        }
    });
}

function setClientCommands(client) {
    client.commands = new Discord.Collection();
    var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //filters only javascript files
    for (var file of commandFiles) {
        var command = require(`./commands/${file}`);
        client.commands.set(command.name, command); // set a new item in the Collection with the key as the command name and the value as the exported module
    }
}