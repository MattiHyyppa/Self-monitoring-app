import { Application } from './deps.js';
import { router } from './routes/routes.js';
import { errorMiddleware, requestTimingMiddleware } from './middlewares/logging.js';
import { serveStaticFilesMiddleware } from './middlewares/serveFiles.js';
import { limitAccessMiddleware } from './middlewares/accessControl.js';
import { viewEngine, engineFactory, adapterFactory, Session, oakCors } from './deps.js';

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: './views'
}));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

app.use(limitAccessMiddleware);

app.use(errorMiddleware);
app.use(requestTimingMiddleware);
app.use(serveStaticFilesMiddleware);
app.use(oakCors());

app.use(router.routes());

let port = 7777;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
  }

if (!Deno.env.get('TEST')) {
    app.listen({ port: port });
}
    
export default app;