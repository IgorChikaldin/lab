
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "local-student-demo-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.use(express.static(path.join(__dirname, "../public")));

// Временное хранилище зарегистрированных студентов
// После перезапуска сервера данные удаляются.
const students = [];

// Регистрация
app.post("/api/register", async (req, res) => {
    try {
        const { name, login, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof login !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !login.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Заполните все поля"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Пароль должен содержать минимум 6 символов"
            });
        }

        const normalizedLogin = login.trim();

        const existingStudent = students.find(
            student => student.login.toLowerCase() ===
                       normalizedLogin.toLowerCase()
        );

        if (existingStudent) {
            return res.status(409).json({
                message: "Такой логин уже занят"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        students.push({
            name: name.trim(),
            login: normalizedLogin,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Регистрация прошла успешно"
        });

    } catch (error) {
        res.status(500).json({
            message: "Ошибка сервера при регистрации"
        });
    }
});

// Вход
app.post("/api/login", async (req, res) => {
    try {
        const { login, password } = req.body;

        if (
            typeof login !== "string" ||
            typeof password !== "string" ||
            !login.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Заполните все поля"
            });
        }

        const student = students.find(
            user => user.login.toLowerCase() === login.trim().toLowerCase()
        );

        if (!student) {
            return res.status(401).json({
                message: "Неверный логин или пароль"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Неверный логин или пароль"
            });
        }

        req.session.student = {
            name: student.name,
            login: student.login
        };

        res.json({
            message: "Вход выполнен успешно",
            student: {
                name: student.name
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Ошибка сервера при входе"
        });
    }
});

// Защищенный профиль
app.get("/api/profile", (req, res) => {
    if (!req.session.student) {
        return res.status(401).json({
            message: "Необходима авторизация"
        });
    }

    res.json({
        name: req.session.student.name
    });
});

// Выход
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Ошибка выхода"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Выход выполнен успешно"
        });
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});
