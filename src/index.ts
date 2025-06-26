import { getSandbox, type Sandbox } from '@cloudflare/sandbox';

export { Sandbox } from '@cloudflare/sandbox';

type Env = {
	Sandbox: DurableObjectNamespace<Sandbox>;
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const pathname = new URL(request.url).pathname;

		if (pathname.startsWith('/api')) {
			const sandbox = getSandbox(env.Sandbox, 'my-sandbox');

			await sandbox.gitCheckout('https://github.com/charl-kruger/basic-cloudflare-worker.git', {
				branch: 'main',
			});

			await sandbox.exec('npm', ['install'], {
				stream: false,
			});

			await sandbox.exec('npx', ['wrangler', 'build'], {
				stream: false,
			});

			return sandbox.containerFetch(request);
		}

		return new Response('Not found', { status: 404 });
	},
};
