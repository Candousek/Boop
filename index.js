require('dotenv').config();
const { GClient, Plugins, Command, Component } = require('gcommands');
const { Intents } = require('discord.js');
const { join } = require('path');

Component.setDefaults({
	onError: (ctx, error) => {
		return ctx.reply('Oops! Something went wrong')
	} 
});

Plugins.search(__dirname);

const client = new GClient({
	dirs: [
		join(__dirname, 'commands'),
		join(__dirname, 'components'),
		join(__dirname, 'listeners')
	],
	messageSupport: true,
	messagePrefix: '!',
	devGuildId: process.env.DEV_SERVER,
	intents: Object.keys(Intents.FLAGS),
});

// Login to the discord API
client.login(process.env.TOKEN);