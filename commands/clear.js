const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear all the messages in the channel.'),
    async execute(interaction) {
        const messages = await interaction.channel.messages.fetch({limit: 100});
        await messages.forEach(message => {
            message.delete();
        }
        );
        await interaction.reply({content: 'Channel cleared !', ephemeral: true});
    },
};