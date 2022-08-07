const { Command } = require("gcommands");
const fs = require("fs");

new Command({
    name: "banlist",
    description: "Shows list of banned users",
    type: [ "SLASH" ],
    defaultMemberPermissions: "BAN_MEMBERS",
    arguments: [
        {
            name: "filter",
            description: "What should not user's tag contain - separated by , (e.g. candy,klema,developer)",
            type: "STRING",
            required: false
        }
    ],
    run: async (ctx) => {

        await ctx.deferReply();
        const filters = (ctx.arguments.getString("filter")||"---------------------------------").split(",");
        const banlist = await ctx.guild.bans.fetch();
        const filtered = banlist.map(b => b).filter(b => {
            return filters.some(f => b.user.username.includes(f)) ? false : true;
        });

        console.log(filtered);

        fs.writeFileSync("../../output.txt", `Filters: ${filters.join(", ") || "None"}\nRequested by: ${ctx.user.tag}\n\n---------------------------------\n` + filtered.map(b => `${b.user.username}#${b.user.discriminator} ► ${b.reason}`).join("\n"));

        await ctx.safeReply({
            files: [ "../../output.txt" ]
        })

    }
});