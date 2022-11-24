import { send } from "../deps.js";

// logs all the errors
const errorMiddleware = async (context, next) => {
    try {
        await next();
    } catch (e) {
        context.response.status = 500;
        console.log(e);
    }
};

// logs all request info
const requestMiddleware = async ({ request, state: { session } }, next) => {
    const today = new Date();
    var date = today.toJSON().slice(0, 10);
    var time = today.toJSON().slice(11, 19);
    var dateTime = date + " " + time;
    const user = await session.get("user");
    let id = user ? user.id : "anonymous";
    console.log(
        `${dateTime} - ${request.method} ${request.url.pathname} - user:${id}`
    );
    await next();
};

// controls access to static files
const serveStaticFilesMiddleware = async (context, next) => {
    if (context.request.url.pathname.startsWith("/static")) {
        const path = context.request.url.pathname.substring(7);

        await send(context, path, {
            root: `${Deno.cwd()}/static`,
        });
    } else {
        await next();
    }
};

// controls access to the application
const authMiddleware = async ({ request, response, state: { session } }, next) => {
    if (request.url.pathname.startsWith("/behavior")) {
        if (session && (await session.get("authenticated"))) {
            await next();
        } else {
            response.redirect("/auth/login");
        }
    } else {
        await next();
    }
};

export {
    errorMiddleware,
    requestMiddleware,
    serveStaticFilesMiddleware,
    authMiddleware,
};
