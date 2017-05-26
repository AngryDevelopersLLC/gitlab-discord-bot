const util = require('util');
const discord = require('../discord');

class Event {
	format(body) {
		return new Promise(function (resolve) {
			let embed = {};
			let status = body.object_attributes.status;
			let id = body.object_attributes.id;
			let project = body.project.name;

			embed.title = 'Pipeline for ' + project + ' #' + id + ' changed to ' + status;
			if (status === 'pending')
				embed.color = 0xfef79b;
			if (status === 'success')
				embed.color = 0x8dc740;
			if (status === 'running')
				embed.color = 0x00b0ad;
			if (status === 'canceled')
				embed.color = 0xee937e;
			if (status === 'failed')
				embed.color = 0xc22854;
			embed.url = body.commit.url + '/pipeline';

			embed.author = discord.create_author_obj(body.user.name, body.user.avatar_url);

			embed.fields = [];
			let builds = body.builds;
			builds.sort((a, b)=>a.id>=b.id)

			for (let build of builds) {
				let shorthand = build.id;
				let message = build.stage + ' ' + build.status;
				let description = util.format('- **%s**', build.user.name);

				embed.fields.push({
					name: util.format('`%s` %s', shorthand, build.name),
					value: message + '\n' + description,
					inline: false
				});
			}

			resolve({ embeds: [embed] });
		});
	}
}

module.exports = Event;
