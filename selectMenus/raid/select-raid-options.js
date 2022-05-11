const { DiscordAPIError } = require("@discordjs/rest");
const { PermissionOverwrites, Permissions, Collection, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const dotenv = require("dotenv");
const ciqlJson = require("ciql-json");

dotenv.config();

module.exports = {
    data: {
        name: `select-raid-options`
    },
    async execute (interaction) {
        let guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);
        let raidEvent = {};
        switch (interaction.values[0]) {
            case 'raid_channel':
                let raidChannel = guild.channels.cache.find(channel => channel.name === 'raid');
                const setTitle = new MessageEmbed().setColor('#e4e8eb').setTitle('Entrez le titre de l\'évènement').setDescription('Jusqu\'à 200 caractères sont autorisés.').setFooter({text: 'Pour quitter, tappez "cancel"'});
                const setPicture = new MessageEmbed().setColor('#e4e8eb').setTitle('Entrez le lien de l\'image').setDescription('Collez l\'url de l\'image.');
                const setDescription = new MessageEmbed().setColor('#e4e8eb').setTitle('Entrez la description de l\'évènement').setDescription('Tapez **None** pour aucune description. Jusqu\'à 1600 caractères sont autorisés.').setFooter({text: 'Pour quitter, tappez "cancel"'});
                const setMaxPlayers = new MessageEmbed().setColor('#e4e8eb').setTitle('Entrez le nombre maximum de participants').setDescription('Tapez **None** pour aucune limite. Jusqu\'à 250 participants sont autorisés.').setFooter({text: 'Pour quitter, tappez "cancel"'});
                const setDate = new MessageEmbed().setColor('#e4e8eb').setTitle('Quand l\'évènement doit-il commencer ?').setDescription('> AAA-MM-JJ 00h00').setFooter({text: 'Pour quitter, tappez "cancel"'});
                const setColor = new MessageEmbed().setColor('#e4e8eb').setTitle('Entrez la couleur de l\'Embed').setDescription('Exemple: #FFFFFF').setFooter({text: 'Pour quitter, tappez "cancel"'});

                // send the setTitle message to the user and wait for a response from the user in the same channel then send the setPicture message to the user and wait for a response from the user in the same channel then send the setDescription message to the user and wait for a response from the user in the same channel then send the setMaxPlayers message to the user and wait for a response from the user in the same channel then send the setDate message to the user and wait for a response from the user in the same channel then send the setColor message to the user and wait for a response from the user in the same channel
                await interaction.user.send({embeds: [setTitle]}).then(async (message) => {
                    const filter = m => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    
                    collector.on('collect', m => {
                        if (m.content === 'cancel') {
                            collector.stop();
                            interaction.channel.send('Annulation de l\'action.');
                        } else {
                            // if the title is longer than 200 characters, send an error message and wait for another response
                            if (m.content.length > 200) {
                                interaction.user.send({embeds: [new MessageEmbed().setColor('#e4e8eb').setTitle('Erreur').setDescription('Le titre est trop long.').setFooter({text: 'Pour quitter, tappez "cancel"'})]});
                                return;
                            } else {
                                raidEvent.title = m.content;
                                collector.stop();
                            }
                            interaction.channel.send({ embeds: [setPicture] }).then(async (message) => {
                                const filter = m => m.author.id === interaction.user.id;
                                const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                collector.on('collect', m => {
                                    if (m.content === 'cancel') {
                                        collector.stop();
                                        interaction.channel.send('Annulation de l\'action.');
                                    } else {
                                        raidEvent.image = m.content;
                                        collector.stop();
                                        interaction.channel.send({ embeds: [setDescription] }).then(async (message) => {
                                            const filter = m => m.author.id === interaction.user.id;
                                            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                            collector.on('collect', m => {
                                                if (m.content === 'cancel') {
                                                    collector.stop();
                                                    interaction.channel.send('Annulation de l\'action.');
                                                } else {
                                                    // if the description is longer than 200 characters, send an error message and wait for another response
                                                    if (m.content.length > 1600) {
                                                        interaction.user.send({embeds: [new MessageEmbed().setColor('#e4e8eb').setTitle('Erreur').setDescription('Le titre est trop long.').setFooter({text: 'Pour quitter, tappez "cancel"'})]});
                                                        return;
                                                    } else {
                                                        raidEvent.description = m.content;
                                                        collector.stop();
                                                    }
                                                    interaction.channel.send({ embeds: [setMaxPlayers] }).then(async (message) => {
                                                        const filter = m => m.author.id === interaction.user.id;
                                                        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                                        collector.on('collect', m => {
                                                            if (m.content === 'cancel') {
                                                                collector.stop();
                                                                interaction.channel.send('Annulation de l\'action.');
                                                            } else {
                                                                raidEvent.maxPlayers = m.content;
                                                                collector.stop();
                                                                interaction.channel.send({ embeds: [setDate] }).then(async (message) => {
                                                                    const filter = m => m.author.id === interaction.user.id;
                                                                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                                                    collector.on('collect', m => {
                                                                        if (m.content === 'cancel') {
                                                                            collector.stop();
                                                                            interaction.channel.send('Annulation de l\'action.');
                                                                        } else {
                                                                            raidEvent.date = m.content;
                                                                            collector.stop();
                                                                            interaction.channel.send({ embeds: [setColor] }).then(async (message) => {
                                                                                const filter = m => m.author.id === interaction.user.id;
                                                                                const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                                                                collector.on('collect', m => {
                                                                                    if (m.content === 'cancel') {
                                                                                        collector.stop();
                                                                                        interaction.channel.send('Annulation de l\'action.');
                                                                                    } else {
                                                                                        raidEvent.color = m.content;
                                                                                        collector.stop();
                                                                                        interaction.channel.send('Création de l\'évènement...');
                                                                                        ciqlJson
                                                                                            .open('./storage/raids.json')
                                                                                            .set(
                                                                                                `${interaction.user.username}#${interaction.user.discriminator}`, {
                                                                                                    title: `${raidEvent.title}`,
                                                                                                    picture: raidEvent.picture,
                                                                                                    description: raidEvent.description,
                                                                                                    maxPlayers: raidEvent.maxPlayers,
                                                                                                    date: raidEvent.date,
                                                                                                    color: raidEvent.color,
                                                                                                }
                                                                                                )
                                                                                             .save()
                                                                                        // TODO: send the raid event to the raid channel    
                                                                                        interaction.channel.send('Evènement créé !');
                                                                                    }
                                                                                });
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            break;
            case 'select_channel':
                // Create the Select Menu
                let channelSelectorSelect = new MessageSelectMenu()
                    .setCustomId('select-raid-channel')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: `Annuler`,
                            description: 'Annulez la publication de votre raid.',
                            value: 'cancel',
                        },
                    ]);

                // Get all channels in the guild
                guild.channels.cache.forEach(channel => {
                    // Check if the channel is not the raid channel
                    if (channel.name !== 'raid') {
                        // add channel to the select menu
                        channelSelectorSelect.addOptions([
                            {
                                label: `${channel.name}`, // Option label
                                description: `${channel.name}`, // Option description
                                value: `${channel.id}`, // Option value
                            },
                        ]);
                    }
                })

                //console.log(channelSelectorSelect); Debug to see the select menu
                // interaction.user.send({content: 'hello', components: [channelSelectorSelect]}); Not working
                break;
            }
        await interaction.reply({ content: 'Information envoyée', ephemeral: true });
    }  
}