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
			return sandbox.containerFetch(request);
		}

		return new Response('Not found', { status: 404 });
	},
};
