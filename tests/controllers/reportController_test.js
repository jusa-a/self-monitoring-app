import { superoak } from "../../deps.js";
import { app } from "../../app.js";

Deno.test({
    name:
        "Without authentication GET request to /behavior/reporting redirects to login page",
    async fn() {
        let testClient = await superoak(app);
        await testClient
            .get("/behavior/reporting")
            .expect(new RegExp("Please login"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
