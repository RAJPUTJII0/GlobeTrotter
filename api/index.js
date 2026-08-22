import app from '../backend/src/app.js';

export default function handler(req, res) {
	if (!req.url.startsWith('/api/') && req.url !== '/api' && req.url !== '/health') {
		req.url = `/api${req.url}`;
	}
	return app(req, res);
}