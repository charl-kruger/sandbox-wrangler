import { getSandbox, type Sandbox } from '@cloudflare/sandbox';

export { Sandbox } from '@cloudflare/sandbox';

type Env = {
	Sandbox: DurableObjectNamespace<Sandbox>;
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const sandbox = getSandbox(env.Sandbox, 'my-sandbox');

		await sandbox.gitCheckout('https://github.com/charl-kruger/basic-cloudflare-worker.git', {
			branch: 'main',
		});

		const install = await sandbox.exec('npm', ['install'], {
			stream: false,
		});

		console.log('npm install', install);

		const result = await sandbox.exec('npx', ['wrangler', 'build'], {
			stream: false,
		});

		console.log('result', result);

		return new Response(JSON.stringify(result, null, 2), {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	},
};
