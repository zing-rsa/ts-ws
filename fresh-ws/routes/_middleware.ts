import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext ) {
    if(ctx.destination != 'route') return ctx.next();

    const cookies: Record<string, string> = {};
    
    req.headers.get('Cookie')?.split(';').forEach((cs) => {
        cookies[cs.split('=')[0]] = cs.split('=')[1];
    });

    ctx.state.cookies = cookies;

    return ctx.next();

}