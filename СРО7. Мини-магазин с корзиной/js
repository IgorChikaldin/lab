
const STORAGE_KEY = "logisticsWarehouseV1";

const initialProducts = [
    { id: 1, name: "Ноутбук", category: "Электроника", quantity: 10, price: 250000 },
    { id: 2, name: "Мышь", category: "Аксессуары", quantity: 25, price: 5000 },
    { id: 3, name: "Клавиатура", category: "Аксессуары", quantity: 15, price: 12000 }
];

let products = [];
let history = [];

const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const historyTable = document.getElementById("historyTable");
const searchInput = document.getElementById("searchInput");
const formMessage = document.getElementById("formMessage");

// Проверка товара
function isValidProduct(product) {
    return product &&
        Number.isSafeInteger(product.id) &&
        product.id > 0 &&
        typeof product.name === "string" &&
        product.name.trim() !== "" &&
        typeof product.category === "string" &&
        product.category.trim() !== "" &&
        Number.isSafeInteger(product.quantity) &&
        product.quantity >= 0 &&
        typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price > 0;
}

// Проверка истории
function isValidOperation(operation) {
    return operation &&
        typeof operation.type === "string" &&
        typeof operation.name === "string" &&
        Number.isSafeInteger(operation.quantity) &&
        operation.quantity >= 0 &&
        typeof operation.date === "string";
}

// Сохранение данных
function saveData() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ products, history })
        );
        return true;
    } catch (error) {
        showMessage("Ошибка сохранения данных.", "error");
        return false;
    }
}

// Загрузка данных
function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            products = initialProducts.map(product => ({ ...product }));
            history = [];
            saveData();
            return;
        }

        const data = JSON.parse(saved);

        if (
            !data ||
            !Array.isArray(data.products) ||
            !Array.isArray(data.history) ||
            !data.products.every(isValidProduct) ||
            !data.history.every(isValidOperation) ||
            new Set(data.products.map(p => p.id)).size !== data.products.length
        ) {
            throw new Error("Некорректные данные");
        }

        products = data.products;
        history = data.history;
    } catch (error) {
        products = initialProducts.map(product => ({ ...product }));
        history = [];
        showMessage("Ошибка данных. Загружены начальные товары.", "error");
    }
}

// Поиск товара по коду
function findProduct(id) {
    return products.find(product => product.id === id);
}

// Вывод сообщения
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `message ${type}`;
}

// Добавление ячейки таблицы
function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = String(value);
    row.appendChild(cell);
    return cell;
}

// Форматирование цены
function formatMoney(value) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "KZT",
        maximumFractionDigits: 2
    }).format(value);
}

// Запись операции в историю
function recordOperation(type, product, quantity) {
    history.unshift({
        type,
        name: product.name,
        quantity,
        date: new Date().toLocaleString("ru-RU")
    });

    history = history.slice(0, 1000);
}

// Добавление товара
productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const quantityText = document.getElementById("productQuantity").value.trim();
    const priceText = document.getElementById("productPrice").value.trim();

    const quantity = Number(quantityText);
    const price = Number(priceText);

    if (!name || !category) {
        showMessage("Заполните название и категорию.", "error");
        return;
    }

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        showMessage("Количество должно быть целым числом больше нуля.", "error");
        return;
    }

    if (priceText === "" || !Number.isFinite(price) || price <= 0) {
        showMessage("Цена должна быть больше нуля.", "error");
        return;
    }

    const duplicate = products.some(product =>
        product.name.toLocaleLowerCase("ru-RU") ===
        name.toLocaleLowerCase("ru-RU")
    );

    if (duplicate) {
        showMessage("Такой товар уже существует.", "error");
        return;
    }

    const id = products.reduce(
        (max, product) => Math.max(max, product.id), 0
    ) + 1;

    if (!Number.isSafeInteger(id)) {
        showMessage("Не удалось создать код товара.", "error");
        return;
    }

    const product = { id, name, category, quantity, price };

    products.push(product);
    recordOperation("Добавление", product, quantity);

    if (!saveData()) {
        products.pop();
        history.shift();
        return;
    }

    productForm.reset();
    showMessage("Товар успешно добавлен.", "success");
    renderAll();
});

// Поступление и списание
function changeStock(id, operation) {
    const product = findProduct(id);

    if (!product) {
        showMessage("Товар не найден.", "error");
        return;
    }

    const input = prompt(
        `Введите количество для операции "${operation}" товара "${product.name}":`
    );

    if (input === null) return;

    const text = input.trim();
    const quantity = Number(text);

    if (!text || !Number.isSafeInteger(quantity) || quantity <= 0) {
        alert("Введите целое положительное количество.");
        return;
    }

    if (operation === "Списание" && quantity > product.quantity) {
        alert(`Недостаточно товара! Остаток: ${product.quantity} шт.`);
        return;
    }

    if (
        operation === "Поступление" &&
        !Number.isSafeInteger(product.quantity + quantity)
    ) {
        alert("Слишком большое количество.");
        return;
    }

    const oldQuantity = product.quantity;
    const oldHistory = [...history];

    if (operation === "Поступление") {
        product.quantity += quantity;
    } else {
        product.quantity -= quantity;
    }

    recordOperation(operation, product, quantity);

    if (!saveData()) {
        product.quantity = oldQuantity;
        history = oldHistory;
        return;
    }

    showMessage(`${operation}: ${product.name}, ${quantity} шт.`, "success");
    renderAll();
}

// Удаление товара вместе с остатком
function deleteProduct(id) {
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        showMessage("Товар не найден.", "error");
        return;
    }

    const product = products[index];

    const confirmed = confirm(
        `Удалить товар "${product.name}"?\n` +
        `Остаток: ${product.quantity} шт.\n` +
        "Товар будет удалён из списка склада."
    );

    if (!confirmed) return;

    const oldHistory = [...history];

    products.splice(index, 1);
    recordOperation("Удаление товара", product, product.quantity);

    if (!saveData()) {
        products.splice(index, 0, product);
        history = oldHistory;
        return;
    }

    showMessage(`Товар "${product.name}" удалён.`, "success");
    renderAll();
}

// Отображение товаров и кнопок
function renderProducts() {
    productTable.replaceChildren();

    const query = searchInput.value.trim().toLocaleLowerCase("ru-RU");

    const filtered = products.filter(product =>
        product.name.toLocaleLowerCase("ru-RU").includes(query) ||
        product.category.toLocaleLowerCase("ru-RU").includes(query) ||
        String(product.id).includes(query)
    );

    document.getElementById("emptyMessage").hidden = filtered.length !== 0;

    for (const product of filtered) {
        const row = document.createElement("tr");

        addCell(row, product.id);
        addCell(row, product.name);
        addCell(row, product.category);

        const quantityCell = addCell(row, product.quantity);
        quantityCell.className =
            product.quantity <= 5 ? "stock-low" : "stock-ok";

        addCell(row, formatMoney(product.price));
        addCell(row, formatMoney(product.quantity * product.price));

        const actionCell = document.createElement("td");
        const buttons = document.createElement("div");
        buttons.className = "operation-buttons";

        const receiveButton = document.createElement("button");
        receiveButton.type = "button";
        receiveButton.className = "btn receive";
        receiveButton.textContent = "+ Приход";
        receiveButton.addEventListener("click", () =>
            changeStock(product.id, "Поступление")
        );

        const writeOffButton = document.createElement("button");
        writeOffButton.type = "button";
        writeOffButton.className = "btn write-off";
        writeOffButton.textContent = "− Списание";
        writeOffButton.addEventListener("click", () =>
            changeStock(product.id, "Списание")
        );

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn delete-product";
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener("click", () =>
            deleteProduct(product.id)
        );

        buttons.append(receiveButton, writeOffButton, deleteButton);
        actionCell.appendChild(buttons);
        row.appendChild(actionCell);
        productTable.appendChild(row);
    }
}

// История операций
function renderHistory() {
    historyTable.replaceChildren();

    document.getElementById("historyEmpty").hidden = history.length !== 0;

    for (const operation of history) {
        const row = document.createElement("tr");

        addCell(row, operation.date);
        addCell(row, operation.type);
        addCell(row, operation.name);
        addCell(row, operation.quantity);

        historyTable.appendChild(row);
    }
}

// Общая статистика
function renderStats() {
    const totalQuantity = products.reduce(
        (sum, product) => sum + product.quantity, 0
    );

    const totalValue = products.reduce(
        (sum, product) => sum + product.quantity * product.price, 0
    );

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalValue").textContent = formatMoney(totalValue);
}

// Обновление всех разделов
function renderAll() {
    renderProducts();
    renderHistory();
    renderStats();
}

// Поиск при вводе текста
searchInput.addEventListener("input", renderProducts);

// Очистка истории
document.getElementById("clearHistory").addEventListener("click", () => {
    if (history.length === 0) {
        alert("История уже пуста.");
        return;
    }

    if (!confirm("Удалить всю историю операций?")) return;

    const oldHistory = history;
    history = [];

    if (!saveData()) {
        history = oldHistory;
        return;
    }

    renderHistory();
    showMessage("История операций очищена.", "success");
});

// Запуск приложения
loadData();
renderAll();

