
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");
const profile = document.getElementById("profile");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const logoutBtn = document.getElementById("logoutBtn");

// Переключение на регистрацию
showRegister.addEventListener("click", () => {
    loginForm.hidden = true;
    registerForm.hidden = false;
    message.textContent = "";
});

// Возврат ко входу
showLogin.addEventListener("click", () => {
    registerForm.hidden = true;
    loginForm.hidden = false;
    message.textContent = "";
});

// Регистрация
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const login = document.getElementById("regLogin").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!name || !login || !password) {
        showMessage("Заполните все поля!", "error");
        return;
    }

    if (password.length < 6) {
        showMessage("Пароль должен содержать минимум 6 символов", "error");
        return;
    }

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, login, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showMessage("Регистрация успешна! Теперь войдите.", "success");

        registerForm.reset();
        registerForm.hidden = true;
        loginForm.hidden = false;

        document.getElementById("login").value = login;

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Вход
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;

    if (!login || !password) {
        showMessage("Заполните все поля!", "error");
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        loginForm.hidden = true;
        registerForm.hidden = true;
        profile.hidden = false;

        document.getElementById("studentName").textContent =
            "Студент: " + data.student.name;

        showMessage("Вход выполнен успешно!", "success");

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Выход
logoutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/logout", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Не удалось выполнить выход");
        }

        profile.hidden = true;
        loginForm.hidden = false;
        registerForm.hidden = true;

        loginForm.reset();

        showMessage("Вы успешно вышли из аккаунта.", "success");

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Вывод сообщений
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}
