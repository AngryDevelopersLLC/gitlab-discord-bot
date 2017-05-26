const util = require('util');

const git = require('../git');
const discord = require('../discord');

class Formatter {
	format(body) {
		return new Promise(function(resolve) {
			let embed = {};

			embed.title = body.commits.length > 1 ?
				'Pushed ' + body.commits.length + ' commits' : 'Pushed a commit';

			embed.description = util.format('to branch **%s** of **%s**', git.getBranchName(body.ref), body.project.name);
			embed.url = git.getCommitDiffURL(body.project.web_url, body.before, body.after);

			embed.color = 0x00bcd4;
			embed.author = discord.create_author_obj(body.user_name, body.user_avatar);

			embed.fields = [];

			for (let commit of body.commits) {
				let shorthand = commit.id.substring(0, 8);
				let message = commit.message.split('\n');
				let description = util.format('- **%s**', commit.author.name);

				if (message.length > 1) {
					description = message.slice(1, message.length).join('\n') + '\n' + description;
				}

				embed.fields.push({
					name: util.format('`%s` %s', shorthand, message[0]),
					value: description,
					inline: false
				});
			}

			resolve({ embeds: [ embed ] });
		});
	}
}

module.exports = Formatter;
