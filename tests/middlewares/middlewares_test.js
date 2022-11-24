import * as middlewares from "../../middlewares/middlewares.js";
import { superoak } from "../../deps.js";
import { app } from "../../app.js";

Deno.test({
    name: "User can access /behavior...  only if authenticated",
    async fn() {
        const getAuthenticated = (param) => {
            return true;
        };

        const context = {
            request: {
                url: {
                    pathname: "/behavior",
                },
            },
            state: { session: { get: getAuthenticated } },
        };

        const next = () => {};

        middlewares.authMiddleware(context, next);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "errorMiddleware catches and logs errors",
    async fn() {
        const context = {
            response: {},
        };

        const context2 = () => {
            throw Error("test!");
        };

        const next = () => {};

        await middlewares.errorMiddleware(context, next);
        await middlewares.errorMiddleware(context, context2);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "requestMiddleware logs request info",
    async fn() {
        const getUser = (param) => {
            return {
                id: 1,
                email: "test@email.com",
            };
        };

        const context = {
            request: {
                method: "TEST",
                url: {
                    pathname: "/test",
                },
            },
            state: { session: { get: getUser } },
        };

        const next = () => {};

        await middlewares.requestMiddleware(context, next);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
