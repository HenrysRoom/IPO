const socket = io();
const username = prompt("Enter your name:");

let state = loadState();
render(state);

function render(state) {
    ["input", "process", "output"].forEach(id => {
        const column = document.getElementById(id);
        column.innerHTML = `<h2>${id.toUpperCase()}</h2>`;

        state[id].forEach(item => {
            const box = document.createElement("div");
            box.className = "box";
            box.innerHTML = `<strong>${item.user}:</strong> ${item.text}`;
            column.appendChild(box);
        });
    });

    // AUTO SAVE EVERY TIME STATE UPDATES
    saveState(state);
}

function loadState() {
    const saved = localStorage.getItem("ipo-state");
    return saved ? JSON.parse(saved) : {
        input: [],
        process: [],
        output: []
    };
}

// Receive full synced state
socket.on("init", (newState) => {
    state = newState;
    render(state);
});

// Add new box
function addBox(columnId) {
    const text = prompt("Enter text:");
    if (!text) return;

    const newItem = {
        text,
        user: username
    };

    state[columnId].push(newItem);

    render(state);

    socket.emit("update", {
        column: columnId,
        text,
        user: username
    });
}

// Saving

function saveState(state) {
    localStorage.setItem("ipo-state", JSON.stringify(state));
}
