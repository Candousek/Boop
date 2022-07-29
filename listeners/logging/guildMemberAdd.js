const { Listener } = require('gcommands');

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Member Add',
    event: 'guildMemberAdd',
    run: (member) => {
        const client = member.client;
        client.modules.base.log(client, `<a:nekoblush:933631882476806226> ${member.user.tag} has joined the server. Account created at <t:${Math.floor(member.user.createdTimestamp/1000)}>. <@${member.id}>${(member.user.createdTimestamp > +new Date()-30*86400*1000 ) ? "\n⚠️ Account is younger than 30 days." : ""}`)
	}
});