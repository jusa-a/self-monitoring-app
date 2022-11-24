import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";
import { viewEngine, ejsEngine, oakAdapter } from "./deps.js";
import { Session } from "./deps.js";
import { oakCors } from "./deps.js";

const app = new Application();

app.use(
    viewEngine(oakAdapter, ejsEngine, {
        viewRoot: "./views",
    })
);

app.use(Session.initMiddleware());

app.use(middleware.errorMiddleware);
app.use(middleware.requestMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(middleware.authMiddleware);

app.use(oakCors());

app.use(router.routes());

let port = 7777;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}

if (!Deno.env.get("TEST_ENVIRONMENT")) {
    app.listen({ port: port });
}

export { app };
