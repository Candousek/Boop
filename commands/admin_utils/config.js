const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');

new Command({
    name: 'config',
    description: 'Edit bots configuration.',
    defaultMemberPermissions: "ADMINISTRATOR",
    type: [ CommandType.SLASH ],
    arguments: [
        {
            name: "show",
            description: "Shows the current configuration.",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "key",
                    description: "The key of the configuration to show.",
                    type: ArgumentType.STRING,
                }
            ]
        },
        {
            name: "set",
            description: "Sets a configuration value.",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "key",
                    description: "The key of the configuration value.",
                    type: ArgumentType.STRING,
                    required: true
                },
                {
                    name: "value",
                    description: "The value of the configuration value.",
                    type: ArgumentType.STRING,
                    required: true
                },
            ]
        },
        {
            name: "unset",
            description: "unsets a configuration value.",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                {
                    name: "key",
                    description: "The key of the configuration value.",
                    type: ArgumentType.STRING,
                    required: true
                },
            ]
        }
    ],
    run: async (ctx) => {

        const subCommand = ctx.arguments.getSubcommand();

        const key = ctx.arguments.getString("key");
        const value = ctx.arguments.getString("value");

        switch(subCommand) {
            case "show":
                if(key) {
                    const config = await ctx.client.modules.config.get(key);
                    return ctx.reply({
                        content: `\`\`\`${key}: ${config||"<not set>"}\`\`\``
                    });
                }
                const config = await ctx.client.modules.config.getAll();
                const configString = config.map(c => `${c.configkey} => ${c.configvalue}`).join("\n");
                ctx.reply({
                    content: `Current configuration:\n\`\`\`${configString||"<not set>"}\`\`\``
                });
                break;
            case "set": {
                const before = await ctx.client.modules.config.get(key);
                await ctx.client.modules.config.set(key, value);
                ctx.reply({
                    content: `> <:XYes:756489965369819227> Ξ Configuration value \`${key}\` set to \`${value}\``
                });
                ctx.client.modules.base.log(ctx.client, `📝 ${ctx.user.tag} changed the configuration value \`${key}\` to \`${value}\`\n> Before: \`${before||"<not set>"}\``);
                return true;
            }
            case "<not set>": {
                const before = await ctx.client.modules.config.get(key);
                await ctx.client.modules.config.delete(key);
                ctx.reply({
                    content: `> <:XYes:756489965369819227> Ξ Configuration value \`${key}\` <not set>.`
                });
                ctx.client.modules.base.log(ctx.client, `📝 ${ctx.user.tag} unset configuration value for key \`${key}\`\n> Before: \`${before||"<not set>"}\``);
                return true;
            }
        }


    }
});