const winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true, level: 'debug'});
const app = require('./app.js');
const handler = new (require('./handler'))(app);
const executor = new (require('./executor'))(app);

const express = require('express');
const router = express.Router();

router.post('/webhook/:name', function (req, res) {
	let token = req.headers['x-gitlab-token'];

	if (token != app.config.authentication.secret) {
		return res.status(403).json({
			error: 'Not authenticated'
		});
	}

	let name = req.params.name;

	if (!name || name.length <= 0) {
		return res.status(400).json({
			error: 'Bad request',
			details: 'Missing :name parameter'
		});
	}

	let webhook = executor.getWebhook(name);

	if (webhook == null) {
		return res.status(400).json({
			error: 'Bad request',
			details: 'Invalid :name'
		});
	}

	if (!handler.isEventSupported(req.body)) {
        winston.error('Event type not supported' + JSON.stringify(req.body));
		return res.status(501).json({
			error: 'Unsupported',
			details: 'Event type not supported'
		});
	}
	// Create message send post webhook
	handler.createMessage(req.body).then(function(message) {
		res.status(202).send();
        executor.execute(message, webhook);
	}).catch(function(err) {
		winston.error('Unexpected error processing event', err);

		return res.status(503).json(err);
	});
});

module.exports = router;
