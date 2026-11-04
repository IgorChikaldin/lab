import {
    formalGreeting,
    friendlyGreeting,
    creativeGreeting
} from "./greetings.js";

import {
    showGreeting,
    showError,
    clearScreen
} from "./ui.js";

const nameInput = document.getElementById("userName");
const templateSelect = document.getElementById("template");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

function generateGreeting() {
    const name = nameInput.value.trim();

    if (name === "") {
        showError("Пожалуйста, введите имя!");
        return;
    }

    if (!/^[\p{L}\s'-]+$/u.test(name)) {
        showError("Введите корректное имя!");
        return;
    }

    let greeting;

    switch (templateSelect.value) {
        case "formal":
            greeting = formalGreeting(name);
            break;

        case "friendly":
            greeting = friendlyGreeting(name);
            break;

        case "creative":
            greeting = creativeGreeting(name);
            break;

        default:
            showError("Выберите шаблон!");
            return;
    }

    showGreeting(greeting);
}

generateBtn.addEventListener("click", generateGreeting);

clearBtn.addEventListener("click", clearScreen);
