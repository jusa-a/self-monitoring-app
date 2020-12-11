import { superoak } from "../../deps.js";
import { app } from "../../app.js";

Deno.test({
    name: "GET request to / renders the landing page",
    async fn() {
        let testClient = await superoak(app);
        const response = await testClient.get("/");
        console.log(response.text);
        testClient = await superoak(app);
        await testClient
            .get("/")
            .expect(200)
            .expect(new RegExp("Simple application for self-monitoring!"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "POST request to / responds with 404",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/").expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
