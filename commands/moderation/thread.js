const { Command } = require("gcommands");

new Command({
    name: "thread",
    description: "Command to manage threads.",
    type: [ "SLASH" ],
    defaultMemberPermissions: "MANAGE_MESSAGES",
    arguments: [
        {
            name: "archive",
            description: "Archive a thread.",
            type: "SUB_COMMAND",
            arguments: [
                {
                    name: "thread",
                    description: "The thread to archive.",
                    type: "CHANNEL",
                    required: false
                }
            ]
        }
    ],
    run: async (ctx) => {

        const action = ctx.arguments.getSubcommand();
        const thread = ctx.arguments.getChannel("thread")||ctx.channel;

        await ctx.deferReply({
            ephemeral: true
        });

        switch(action) {
            case "archive": {
                if(thread.type != "GUILD_PUBLIC_THREAD" && thread.type != "GUILD_PRIVATE_THREAD") return ctx.safeReply({
                    content: `> <:XNo:756467541794226198> Ξ This is not a thread.`,
                });
                if(thread.archived) return ctx.safeReply({
                    content: `> <:XNo:756467541794226198> Ξ This thread is already archived.`,
                })
                await thread.send({
                    content: `> <:XYes:756489965369819227> Ξ Thread has been archived by ${ctx.user.toString()}.`,
                });
                await ctx.safeReply({
                    content: `> <:XYes:756489965369819227> Ξ Thread has been archived.`,
                })
                await thread.setArchived(true);
                return true;
            }
        }

    }
});