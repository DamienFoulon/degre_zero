const fs = require('fs');
const dotenv = require('dotenv');
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'MESSAGE_CREATE', 'MESSAGE_DELETE', 'MESSAGE_UPDATE'],
});

dotenv.config();

// Command Handler
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


// Event Handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Button Handler
client.buttons = new Collection();
const buttonFolders = fs.readdirSync('./buttons');

for (const folder of buttonFolders) {
	const buttonFiles = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of buttonFiles) {
		const button = require(`./buttons/${folder}/${file}`);
		client.buttons.set(button.data.name, button);
	}
}

// Select Menu Handler
client.selectMenus = new Collection();
const selectMenuFolders = fs.readdirSync('./selectMenus');
for (const folder of selectMenuFolders) {
	const selectMenuFiles = fs.readdirSync(`./selectMenus/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of selectMenuFiles) {
		const selectMenu = require(`./selectMenus/${folder}/${file}`);
		client.selectMenus.set(selectMenu.data.name, selectMenu);
	}
}

client.on('interactionCreate', async interaction => {
	if(interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command !', ephemeral: true});
		}
	} else if(interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if(!button) return;

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing the button script !', ephemeral: true});
		}
	} else if(interaction.isSelectMenu()) {
		const selectMenu = client.selectMenus.get(interaction.customId);

		if(!selectMenu) return;

		try {
			await selectMenu.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing the select menu script !', ephemeral: true});
		}
	} else {
		return;
	}
})

client.login(process.env.DISCORD_TOKEN);