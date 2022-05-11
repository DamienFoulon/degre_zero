const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const ciqlJson = require("ciql-json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('raid')
		.setDescription('Start a raid !'),
	async execute(interaction) {

        const optionSelectorMessage = new MessageEmbed()
	        .setColor('#e4e8eb')
	        .setTitle('Où souhiatez-vous publier cet évènement ?')
	        .setTimestamp()

        const optionSelectorSelect = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select-raid-options')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: `Dans le canal Raid (${interaction.guild.channels.cache.find(channel => channel.name === 'raid').name})`,
							description: 'Le message s\'affichera dans le canal raid.',
							value: 'raid_channel',
						},
						{
							label: 'Dans un autre canal',
							description: 'Le message s\'afficheras dans le canal que vous sélectionnerez.',
							value: 'select_channel',
						},
					]),
	        );
		ciqlJson
    	   .open("./storage/raids.json")
		   .set(
			   `${interaction.user.username}#${interaction.user.discriminator}`, {
				   title: "",
				   picture: "",
				   description: "",
				   maxPlayers: 0,
				   date: "",
				   color: "",
			   }
			   )
			.save()

        interaction.user.send({embeds: [optionSelectorMessage], components: [optionSelectorSelect]});
		await interaction.reply({content: 'Raid started !', ephemeral: true});
	},
};