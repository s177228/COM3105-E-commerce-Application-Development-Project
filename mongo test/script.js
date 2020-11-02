window.addEventListener("DOMContentLoaded", (evt) => {
    loadMessages(1);
});

const loadMessages = (userId) => {
    fetch("/api/messages", { method: "POST" });
}