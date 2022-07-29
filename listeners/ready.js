const { Listener } = require("gcommands");

new Listener({
    name: "ready",
    event: "ready",
    run: async (client) => {

        client.guilds.cache.map(async guild => {
            await guild.members.fetch();
            await guild.roles.fetch();
            console.log(`Fetched members and roles from ${guild.name}`)
        });

        client.modules.db.initialize();
    },
});
