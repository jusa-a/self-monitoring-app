import { superoak } from "../../deps.js";
import { app } from "../../app.js";

Deno.test({
    name: "GET request to auth/login responds with login page",
    async fn() {
        let testClient = await superoak(app);
        await testClient.get("/auth/Login").expect(new RegExp("Please login"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "GET request to auth/registration responds with login page",
    async fn() {
        let testClient = await superoak(app);
        await testClient
            .get("/auth/registration")
            .expect(new RegExp("Register"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Registering with invalid password re-populates email field",
    async fn() {
        let testClient = await superoak(app);
        await testClient
            .post("/auth/register")
            .send("email=test@email.com&password=t&verification=t")
            .expect(new RegExp("test@email.com"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Login with invalid email/password shows an error message",
    async fn() {
        let testClient = await superoak(app);
        await testClient
            .post("/auth/login")
            .send("email=test@email.com&password=tttt&verification=tttt")
            .expect(new RegExp("Invalid email or password"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
