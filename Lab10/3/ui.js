import { defaultMessage } from "./data.js";

export function showGreeting(message) {
    document.getElementById("result").textContent = message;
    document.getElementById("error").textContent = "";
}

export function showError(message) {
    document.getElementById("error").textContent = message;
    document.getElementById("result").textContent = "";
}

export function clearScreen() {
    document.getElementById("userName").value = "";
    document.getElementById("result").textContent = defaultMessage;
    document.getElementById("error").textContent = "";
}
