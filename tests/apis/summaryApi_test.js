import { superoak } from "../../deps.js";
import { app } from "../../app.js";

Deno.test({
    name: "POST request to /api/summary responds with 404",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/api/summary").expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "GET request to /api/summary responds with JSON document",
    async fn() {
        const testClient = await superoak(app);
        await testClient
            .get("/api/summary")
            .expect(200)
            .expect("Content-Type", new RegExp("application/json"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name:
        "GET request to /api/summary/:year/:month/:day responds with JSON document",
    async fn() {
        const testClient = await superoak(app);
        await testClient
            .get("/api/summary/2020/10/10")
            .expect(200)
            .expect("Content-Type", new RegExp("application/json"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
