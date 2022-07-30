const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');

new Command({
    name: 'voice',
    description: 'Command to manage your temporary voice channel.',
    type: [ CommandType.SLASH ],
    arguments: [
        {
            name: "lock",
            description: "Locks your temporary voice channel.",
            type: ArgumentType.SUB_COMMAND
        },
        {
            name: "unlock",
            description: "Unlocks your temporary voice channel.",
            type: ArgumentType.SUB_COMMAND
        },
        {
            name: "delete",
            description: "Deletes your temporary voice channel.",
            type: ArgumentType.SUB_COMMAND
        },
        {
            name: "add",
            description: "Gives member to join your temporary voice channels (when it is locked).",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "user",
                    description: "The user to add to your temporary voice channel.",
                    type: ArgumentType.USER,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Takes from member permissions to join your channel.",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "user",
                    description: "The user to remove from your temporary voice channel.",
                    type: ArgumentType.USER,
                    required: true
                }
            ]
        },
        {
            name: "ghost",
            description: "Makes your temporary voice channel invisible to non-added members.",
            type: ArgumentType.SUB_COMMAND
        },
        {
            name: "unghost",
            description: "Makes your temporary voice channel visible to everyone.",
            type: ArgumentType.SUB_COMMAND
        },
        {
            name: "bitrate",
            description: "Sets the bitrate of your temporary voice channel.",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "bitrate",
                    description: "The bitrate of your temporary voice channel. (Default: 64)",
                    type: ArgumentType.INTEGER,
                    required: true
                }
            ]
        }
    ],
    run: async (ctx) => {

        const subCommand = ctx.arguments.getSubcommand();
        await ctx.deferReply();

        const channel = (await ctx.client.modules.db.query(`SELECT * FROM voice_channels WHERE owner_id=?`, [ ctx.user.id ]))[0];
        const user_channel = ctx.member.voice?.channel;

        if(!channel) return ctx.safeReply({
            content: `> <:XNo:756467541794226198> Ξ You don't have a temporary voice channel.`
        });
        if(!user_channel) return ctx.safeReply({
            content: `> <:XNo:756467541794226198> Ξ You aren't in a voice channel.`
        });


        switch(subCommand) {
            case "lock":
                user_channel.permissionOverwrites.create(ctx.guild.id, {
                    CONNECT: false,
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel has been locked.`
                });
                break;
            case "unlock":
                user_channel.permissionOverwrites.create(ctx.guild.id, {
                    CONNECT: true,
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel has been unlocked.`
                });
                break;
            case "delete":
                user_channel.delete()
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel has been deleted.`
                });
                break;
            case "add":
                user_channel.permissionOverwrites.create(ctx.arguments.getUser("user"), {
                    CONNECT: true,
                    VIEW_CHANNEL: true
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ ${ctx.arguments.getUser("user").username} has been added to your temporary voice channel.`
                });
                break;
            case "remove":
                user_channel.permissionOverwrites.create(ctx.arguments.getUser("user"), {
                    CONNECT: false
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ ${ctx.arguments.getUser("user").username} has been removed from your temporary voice channel.`
                });
                break;
            case "ghost":
                user_channel.permissionOverwrites.create(ctx.guild.id, {
                    VIEW_CHANNEL: false
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel is now invisible to non-added members.`
                });
                break;
            case "unghost":
                user_channel.permissionOverwrites.create(ctx.guild.id, {
                    VIEW_CHANNEL: true
                });
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel is now visible to everyone.`
                });
                break;
            case "bitrate":
                if(ctx.arguments.getInteger("bitrate") < 8 || ctx.arguments.getInteger("bitrate") > 96) return ctx.safeReply({
                    content: `> <:XNo:756467541794226198> Ξ The bitrate of your temporary voice channel is too high or too low. (Should be between 8 and 96)`
                });
                user_channel.setBitrate(ctx.arguments.getInteger("bitrate")*1000);
                ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Your temporary voice channel's bitrate has been set to ${ctx.arguments.getInteger("bitrate")} kbps.`
                });
        }

    }
});