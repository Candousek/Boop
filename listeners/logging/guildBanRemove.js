const { Listener } = require('gcommands');

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Ban Removed',
    event: 'guildBanRemove',
    run: (ban) => {
        const client = ban.client;
        client.modules.base.log(client, `<a:nekoblush:933631882476806226> ${ban.user.tag} has been unbanned in this guild for \`${ban.reason||"No reason given"}\``)
	}
});