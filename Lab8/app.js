
const form = document.getElementById("shopping-form");
const productInput = document.getElementById("product-input");
const quantityInput = document.getElementById("quantity-input");
const shoppingList = document.getElementById("shopping-list");
const counter = document.getElementById("counter");
const message = document.getElementById("message");
const clearButton = document.getElementById("clear-button");

const STORAGE_KEY = "shoppingList";

// Загрузка товаров из localStorage
function loadProducts() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData === null) {
            return [];
        }

        const data = JSON.parse(savedData);

        if (!Array.isArray(data)) {
            throw new Error("Данные должны быть массивом");
        }

        const valid = data.every(product =>
            product &&
            typeof product === "object" &&
            !Array.isArray(product) &&
            Number.isSafeInteger(product.id) &&
            typeof product.name === "string" &&
            product.name.trim().length > 0 &&
            product.name.length <= 100 &&
            typeof product.completed === "boolean" &&
            (
                product.quantity === undefined ||
                (
                    Number.isSafeInteger(product.quantity) &&
                    product.quantity >= 1 &&
                    product.quantity <= 9999
                )
            )
        );

        if (!valid) {
            throw new Error("Неверный формат товаров");
        }

        // Для старых записей без количества устанавливаем 1
        return data.map(product => ({
            ...product,
            quantity: product.quantity ?? 1
        }));
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        message.textContent =
            "Ошибка сохранённых данных. Проверьте localStorage.";
        return [];
    }
}

let products = loadProducts();

// Сохранение товаров в localStorage
function saveProducts() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(products)
        );
        return true;
    } catch (error) {
        console.error("Ошибка сохранения:", error);
        message.textContent = "Не удалось сохранить список.";
        return false;
    }
}

// Создание идентификатора товара
function createProductId() {
    let id;

    do {
        id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    } while (products.some(product => product.id === id));

    return id;
}

// Отображение списка
function renderProducts() {
    shoppingList.replaceChildren();

    products.forEach(product => {
        const li = document.createElement("li");
        li.className = "shopping-item";

        if (product.completed) {
            li.classList.add("completed");
        }

        // Отметка о покупке
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = product.completed;
        checkbox.setAttribute("aria-label", "Куплено");

        checkbox.addEventListener("change", () => {
            changeProduct(product.id, {
                completed: checkbox.checked
            });
        });

        // Название товара
        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        // Управление количеством
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.type = "button";
        minusButton.textContent = "−";
        minusButton.setAttribute(
            "aria-label",
            `Уменьшить количество: ${product.name}`
        );
        minusButton.disabled = product.quantity <= 1;

        minusButton.addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        const quantityValue = document.createElement("span");
        quantityValue.className = "quantity-value";
        quantityValue.textContent = product.quantity;
        quantityValue.setAttribute("aria-label", "Количество");

        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.textContent = "+";
        plusButton.setAttribute(
            "aria-label",
            `Увеличить количество: ${product.name}`
        );
        plusButton.disabled = product.quantity >= 9999;

        plusButton.addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        quantityControls.append(
            minusButton,
            quantityValue,
            plusButton
        );

        // Редактирование названия
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Изменить";

        editButton.addEventListener("click", () => {
            editProduct(product.id);
        });

        // Удаление товара
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Удалить";

        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        li.append(
            checkbox,
            name,
            quantityControls,
            editButton,
            deleteButton
        );

        shoppingList.appendChild(li);
    });

    const totalQuantity = products.reduce(
        (sum, product) => sum + product.quantity,
        0
    );

    const completedCount = products.filter(
        product => product.completed
    ).length;

    counter.textContent =
        `Товаров: ${products.length} · ` +
        `Всего единиц: ${totalQuantity} · ` +
        `Куплено: ${completedCount}`;
}

// Добавление товара
form.addEventListener("submit", event => {
    event.preventDefault();

    const name = productInput.value.trim();
    const quantity = Number(quantityInput.value);

    if (!name) {
        message.textContent = "Введите название товара.";
        productInput.focus();
        return;
    }

    if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 9999
    ) {
        message.textContent =
            "Количество должно быть целым числом от 1 до 9999.";
        quantityInput.focus();
        return;
    }

    const product = {
        id: createProductId(),
        name,
        quantity,
        completed: false
    };

    products.push(product);

    if (!saveProducts()) {
        products.pop();
        return;
    }

    renderProducts();
    form.reset();
    quantityInput.value = "1";
    message.textContent = "Товар добавлен.";
    productInput.focus();
});

// Увеличение и уменьшение количества
function changeQuantity(id, amount) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const oldQuantity = product.quantity;
    const newQuantity = oldQuantity + amount;

    // Минимум 1, максимум 9999
    if (newQuantity < 1 || newQuantity > 9999) {
        return;
    }

    product.quantity = newQuantity;

    if (!saveProducts()) {
        product.quantity = oldQuantity;
        renderProducts();
        return;
    }

    renderProducts();
    message.textContent = "Количество обновлено.";
}

// Изменение других свойств товара
function changeProduct(id, changes) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const oldCompleted = product.completed;
    product.completed = changes.completed;

    if (!saveProducts()) {
        product.completed = oldCompleted;
        renderProducts();
        return;
    }

    renderProducts();
    message.textContent = "Список обновлён.";
}

// Редактирование названия
function editProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const newName = prompt("Новое название:", product.name);

    if (newName === null) return;

    const name = newName.trim();

    if (!name) {
        message.textContent = "Название не может быть пустым.";
        return;
    }

    if (name.length > 100) {
        message.textContent =
            "Название не должно превышать 100 символов.";
        return;
    }

    const oldName = product.name;
    product.name = name;

    if (!saveProducts()) {
        product.name = oldName;
        return;
    }

    renderProducts();
    message.textContent = "Название изменено.";
}

// Удаление одного товара
function deleteProduct(id) {
    const index = products.findIndex(item => item.id === id);

    if (index === -1) return;

    const removed = products.splice(index, 1)[0];

    if (!saveProducts()) {
        products.splice(index, 0, removed);
        renderProducts();
        return;
    }

    renderProducts();
    message.textContent = "Товар удалён.";
}

// Очистка списка
clearButton.addEventListener("click", () => {
    if (products.length === 0) {
        message.textContent = "Список уже пуст.";
        return;
    }

    if (!confirm("Удалить все товары?")) {
        return;
    }

    const previousProducts = products;
    products = [];

    if (!saveProducts()) {
        products = previousProducts;
        return;
    }

    renderProducts();
    message.textContent = "Список очищен.";
});

// Первоначальное отображение
renderProducts();
