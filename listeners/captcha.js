const { Listener } = require("gcommands");
const { MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");

const verifying = {};

new Listener({
    name: "Captcha",
    event: "interactionCreate",
    run: async (interaction) => {

        if(interaction.customId != "captcha-send" && interaction.customId != "captcha-reason") return;

        
        await interaction.deferReply({
            ephemeral: true
        });
        
        if(verifying[interaction.user.id]) return interaction.editReply({
            content: "> <:XNo:756467541794226198> Ξ Please finish your current verification process before you start another."
        })

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("captcha-send")
                .setLabel("— Try again")
                .setStyle("PRIMARY")
                .setEmoji("<:verified_icon:1001930645758550016>")
        )

        if(interaction.customId == "captcha-send") {
            verifying[interaction.user.id] = true;
            const captcha = await interaction.client.modules.captcha.get();
            const img = new MessageAttachment(new Buffer.from(captcha.captcha.split(",")[1], "base64"), 'captcha.png');
            
            interaction.client.modules.base.log(interaction.client, `<:hcaptcha:1001929307729448960> ${interaction.user.tag} started verification process.`);

            await interaction.editReply({
                ephemeral: true,
                content: `>>> <:lolipolice:993172484532740166>・**__Verification__**\n\nPlease rewrite the text from the image below.`,
                files: [ img ]
            });
            
            const collector = interaction.channel.createMessageCollector({ time: 30000, max: 1, filter: m => m.author.id == interaction.user.id });
            
            collector.on('collect', async m => {
                delete verifying[interaction.user.id];
                const result = await interaction.client.modules.captcha.verify(captcha.uuid, m.content);
                if(result) {
                    interaction.client.modules.base.log(interaction.client, `<:hcaptcha:1001929307729448960> ${interaction.user.tag} successfully verified.`);
                    await interaction.editReply({
                        content: `>>> <:lolipolice:993172484532740166>・**__Verification__**\n\nYou have been verified. You will gain access to the rest of our server in a moment.`,
                        files: []
                    });
                    interaction.member.roles.add(interaction.client.configs.id.captcha.role);
                } else {
                    interaction.client.modules.base.log(interaction.client, `<:hcaptcha:1001929307729448960> ${interaction.user.tag} failed verification process.`);
                    await interaction.editReply({
                        content: `>>> <:lolipolice:993172484532740166>・**__Verification__**\n\nYour answer was incorrect. Please generate a new captcha and try again.`,
                        files: [],
                        components: [ row ]
                    });
                }
                delete [interaction.user.id];
            });
    
            collector.on('end', async collected => {
                delete verifying[interaction.user.id];
                if(collected.size < 1) {
                    interaction.client.modules.base.log(interaction.client, `<:hcaptcha:1001929307729448960> ${interaction.user.tag} didn't make a response in time.`);
                    await interaction.editReply({
                        content: `>>> <:lolipolice:993172484532740166>・**__Verification__**\n\nYou have not verified in time. Please generate a new captcha and try again.`,
                        files: [],
                        components: [ row ]
                    });
                }
            })
        } else {

            await interaction.editReply({
                content: `>>> ❔・__**Why do I need to verify?**__\n\nUsually it's one of those two reason:\na) Our system thinks, that your account is suspicous and could harm our server.\nb) Our server is under a raid.\n\nEither way, you still have to verify.`
            })

        }

    },
});

new Listener({
    name: "Captcha - Delete messages",
    event: "messageCreate",
    run: async (message) => {
        if(message.client.configs.id.auto_delete_messages_channels.includes(message.channel.id) && !message.author.bot) message.delete();
    }
});