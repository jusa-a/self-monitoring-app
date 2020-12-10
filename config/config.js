let config = {};

if (Deno.env.get("TEST_ENVIRONMENT")) {
    config.database = {};
} else {
    config.database = Deno.env.toObject().DATABASE_URL;
}

export { config };
