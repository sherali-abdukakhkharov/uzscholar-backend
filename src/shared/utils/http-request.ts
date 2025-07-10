import * as http from 'http';
import * as https from 'https';

export const parseBody = (request: http.IncomingMessage) => {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks = [];
		request.on('data', (chunk) => chunks.push(chunk));
		request.on('end', () => resolve(Buffer.concat(chunks)));
		request.on('error', reject);
	});
};

export const httpOrHttpsRequest = (method: string, url: string, body?: Buffer) => {
	return new Promise<Buffer>((resolve, reject) => {
		const isHttps = new URL(url).protocol === 'https:' ? true : false;
		const requestProtocol = isHttps ? https : http;

		const client = requestProtocol.request(url, { method }, async (response) => {
			const body = await parseBody(response);
			if (response.statusCode >= 200 && response.statusCode < 300) {
				resolve(body);
			} else {
				reject(body.toString());
			}
		});

		client.on('error', (error) => {
			console.log(`ererprr ===>`, error);
			reject(error);
		});
		client.end(body);
	});
};
