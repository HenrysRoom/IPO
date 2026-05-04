const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// Shared game state (THIS FIXES EVERYTHING)
let state = {
    input: [],
    process: [],
    output: []
};

io.on("connection", (socket) => {
    console.log("User connected");

    // Send full state to new user
    socket.emit("init", state);

    // When client updates something
    socket.on("update", (data) => {
        const { column, text, user } = data;

        state[column].push({ text, user });

        // broadcast updated state to everyone
        io.emit("init", state);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});