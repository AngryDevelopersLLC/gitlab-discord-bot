const util = require('util');
const truncate = require('../truncate');
const discord = require('../discord');

class Event {
    format(body) {
        return new Promise(function (resolve) {
            var embed = {};
            console.log(body)
            var status = body.object_attributes.status;
            var id = body.object_attributes.id;
            var project = body.project.name;


            embed.title = 'Pipeline for ' + project + ' #' + id + ' changed to ' + status;
            if (status === 'success')
                embed.color = 0x46a049;
            if (status === 'success')
                embed.color = 0x46a049;
            embed.url = body.commit.url + '/pipeline';

            //embed.description = truncate(body.object_attributes.note, 240);

            embed.author = discord.create_author_obj(body.user.name, body.user.avatar_url);


            embed.fields = [];

            for (var build of body.builds) {
                var shorthand = build.id;
                var message = build.stage + ' '  + build.status;
                var description = util.format('- **%s**', build.user.name);

                embed.fields.push({
                    name: util.format('`%s` %s', shorthand, build.name),
                    value:  message+ '\n' + description,
                    inline: false
                });
            }

            resolve({ embeds: [embed] });
        });
    }
}

module.exports = Event;
