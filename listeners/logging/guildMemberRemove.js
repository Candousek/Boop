const { Listener } = require('gcommands');

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Member Remove',
    event: 'guildMemberRemove',
    run: (member) => {
        const client = member.client;
        client.modules.base.log(client, `<a:nekoblush:933631882476806226> ${member.user.tag} has left the server.`)
	}
});