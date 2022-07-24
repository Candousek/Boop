const { Inhibitor } = require('gcommands');

class CommandPermissions extends Inhibitor.Inhibitor {
	constructor() {
		super();
	}

	async run(ctx) {
        
        const command = ctx.command;

        if(ctx.command.options.permissions) return true;
        if(!ctx.member.permissions.has(ctx.command.options.permissions)) {
            await ctx.reply({
                content: `Insufficient permissions.`,
                ephemeral: true
            });
            return false;
        }

        return true;

    }
}

module.exports = CommandPermissions;