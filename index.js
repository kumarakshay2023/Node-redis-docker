const express = require("express");
const redis = require("redis");

const app = express();

// Create Redis client
const client = redis.createClient({
    url: "redis://redis-server:6379",
});

client.connect().catch(console.error); // Handle connection errors

// Initialize visits key if not set
(async () => {
    try {
        await client.set("visits", 0, { NX: true }); // NX ensures it's set only if it doesn't exist
    } catch (err) {
        console.error("Redis initialization error:", err);
    }
})();

app.get("/", async (req, res) => {
    try {
        let visits = await client.get("visits");
        visits = parseInt(visits) || 0;
        await client.set("visits", visits + 1);
        res.send(`Visits: ${visits}`);
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("Error connecting to Redis");
    }
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});
