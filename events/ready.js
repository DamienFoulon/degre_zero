module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`OBOT deployed as ${client.user.tag}, and ready to operate !`);
	},
};