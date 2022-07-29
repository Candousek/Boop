const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

new Command({
	name: 'sendverifyinfo',
	description: 'Sends verify message.',
    defaultMemberPermissions: "MANAGE_GUILD",
	type: [ CommandType.SLASH ],
	run: async (ctx) => {

        await ctx.deferReply();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("captcha-send")
                .setLabel("— Verify")
                .setStyle("SUCCESS")
                .setEmoji("<:verified_icon:1001930645758550016>"),
            new MessageButton()
                .setCustomId("captcha-reason")
                .setLabel("— Why do I need to verify?")
                .setStyle("SECONDARY")
                .setEmoji("❔")
        )

        await ctx.channel.send({
            content: `<:hcaptcha:1001929307729448960>・__**Verification**__\n\nHello and welcome to the server! Please click the button below and verify to gain access to the rest of our server.`,
            components: [ row ]
        })


        await ctx.deleteReply();

    }
});