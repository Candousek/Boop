const { Listener } = require("gcommands");

new Listener({
    name: "Role Select Interaction",
    event: "interactionCreate",
    run: async (interaction) => {

        if(!interaction.isSelectMenu()) return;
        if(!interaction.customId.includes("role-select-menu-")) return;
        
        await interaction.deferReply({ ephemeral: true });
        
        const values = interaction.values;
        const client = interaction.client;
        const member = interaction.member;
        const config = client.configs.reaction_roles[interaction.customId.replace("role-select-menu-", "")];

        for (let i = 0; i < config.roles.length; i++) {
            const roleConfig = config.roles[i];
            if(member.roles.cache.has(roleConfig.id) && values.includes(roleConfig.id)) continue;
            await member.roles.remove(roleConfig.id);
        };

        for (let i = 0; i < values.length; i++) {
            const roleId = values[i];
            if(!interaction.guild.roles.cache.has(roleId) || member.roles.cache.has(roleId)) continue;
            await member.roles.add(roleId);
        };

        await interaction.editReply({
            content: `> <a:AnimatedYes:754772459625906297> Ξ Your roles have been updated.`,
        })
        
    },
});
