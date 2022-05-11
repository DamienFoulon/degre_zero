module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        if(interaction.isCommand()){
            console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered the "${interaction.commandName}" interaction.`);
        }
        else if (interaction.isButton()){
            console.log(`${interaction.user.tag} triggered the #${interaction.customId} button in #${interaction.channel.name}`);
        }
        else if (interaction.isSelectMenu()){
            console.log(`${interaction.user.tag} triggered the #${interaction.customId} select menu  with ${interaction.values} options in #${interaction.channel.name}`);
        }
		else{
            console.log(`${interaction.user.tag} triggered an unknow interaction in #${interaction.channel.name}`);
        }
	},
};