
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadBtn = document.getElementById("loadBtn");
const statusElement = document.getElementById("status");
const usersList = document.getElementById("usersList");

// Отображение состояния приложения.
function setStatus(message, state) {
    statusElement.textContent = message;
    statusElement.className = `status ${state}`;
}

// Безопасное отображение пользователей.
function renderUsers(users) {
    const fragment = document.createDocumentFragment();

    users.forEach((user) => {
        const item = document.createElement("li");
        item.className = "user-card";

        const name = document.createElement("h3");
        name.textContent =
            typeof user.name === "string" ? user.name : "Имя не указано";

        const email = document.createElement("p");
        email.textContent =
            typeof user.email === "string"
                ? user.email
                : "Email не указан";

        item.append(name, email);
        fragment.appendChild(item);
    });

    // Заменяем список только после подготовки новых элементов.
    usersList.replaceChildren(fragment);
}

// Загрузка списка пользователей.
async function loadUsers() {
    loadBtn.disabled = true;
    usersList.replaceChildren();
    setStatus("Загрузка пользователей...", "loading");

    try {
        const response = await fetch(API_URL);

        // Проверяем HTTP-ошибки, например 404 или 500.
        if (!response.ok) {
            throw new Error(
                `Ошибка HTTP: ${response.status} ${response.statusText}`
            );
        }

        const users = await response.json();

        // Проверяем, что сервер вернул массив.
        if (!Array.isArray(users)) {
            throw new Error("Сервер вернул данные неверного формата.");
        }

        // Проверяем структуру полученных данных.
        const validUsers = users.filter(
            (user) =>
                user !== null &&
                typeof user === "object" &&
                !Array.isArray(user)
        );

        if (validUsers.length === 0) {
            throw new Error("Список пользователей пуст или некорректен.");
        }

        renderUsers(validUsers);

        setStatus(
            `Успех! Загружено пользователей: ${validUsers.length}.`,
            "success"
        );
    } catch (error) {
        usersList.replaceChildren();

        setStatus(
            `Ошибка загрузки: ${error.message}. Нажмите кнопку, чтобы повторить попытку.`,
            "error"
        );
    } finally {
        // Кнопка снова доступна и после успеха, и после ошибки.
        loadBtn.disabled = false;
    }
}

// Обработчик не перезагружает страницу.
loadBtn.addEventListener("click", loadUsers);

// Первоначальная загрузка при открытии страницы.
loadUsers();
window.fetch = async () =>
    new Response("[]", {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

loadUsers();
window.fetch = async () =>
    new Response("invalid-json", {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

loadUsers();
window.fetch = async () =>
    new Response('{"name":"Test"}', {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

loadUsers();
