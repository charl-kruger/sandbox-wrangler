import { getSandbox } from '@cloudflare/sandbox';

export { Sandbox } from '@cloudflare/sandbox';

export default {
	async fetch(request: Request, env: Env) {
		const sandbox = getSandbox(env.Sandbox, 'my-sandbox');
		const result = await sandbox.exec('ls', ['-la']);

		console.log('result', result);

		return new Response(JSON.stringify(result, null, 2), {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	},
};
