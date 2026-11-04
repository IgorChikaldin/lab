
const formalGreetings = [
    "Здравствуйте, {name}! Рады приветствовать вас!",
    "Добрый день, {name}! Желаем вам успехов!",
    "Приветствуем вас, {name}! Приятного дня!",
    "Уважаемый(ая) {name}, рады вас видеть!",
    "Здравствуйте, {name}! Пусть ваш день будет продуктивным!",
    "Добро пожаловать, {name}! Желаем отличного настроения!",
    "Рады встрече с вами, {name}! Успехов во всех делах!",
    "Добрый день, {name}! Пусть всё задуманное получится!",
    "Приветствуем вас, {name}! Желаем новых достижений!",
    "Здравствуйте, {name}! Пусть сегодня вас ждёт удача!"
];

const friendlyGreetings = [
    "Привет, {name}! Как твои дела? 😊",
    "Йоу, {name}! Рад тебя видеть! 😎",
    "Приветик, {name}! Отличного тебе дня! ❤️",
    "Здравствуй, {name}! Улыбнись, сегодня прекрасный день!",
    "Привет, {name}! Давно не виделись! 🎉",
    "Хей, {name}! Надеюсь, у тебя всё супер!",
    "Привет, {name}! Пусть сегодня всё получится!",
    "Здорово, {name}! Рад нашей встрече!",
    "Привет, {name}! Заряжайся позитивом! ☀️",
    "Хей, {name}! Желаю тебе море хорошего настроения!"
];

const creativeGreetings = [
    "✨ {name}, сегодня твой день! Покори этот мир!",
    "🚀 Внимание! На горизонте появился(ась) {name}!",
    "🌈 {name}, пусть твоя жизнь будет яркой, как радуга!",
    "🔥 {name}, включай режим супергероя! Тебе всё по силам!",
    "🌟 Привет, {name}! Ты способен(на) на невероятные вещи!",
    "🎯 {name}, твоя следующая победа уже близко!",
    "🦄 Привет, {name}! Пусть сегодня случится настоящее чудо!",
    "💎 {name}, ты уникален(на)! Никогда об этом не забывай!",
    "🎉 Встречайте! Сегодня главный герой дня — {name}!",
    "🌍 {name}, мир ждёт твоих великих свершений!"
];

function getRandomGreeting(greetings, name) {
    const randomIndex = Math.floor(Math.random() * greetings.length);

    return greetings[randomIndex].replaceAll("{name}", name);
}

export function formalGreeting(name) {
    return getRandomGreeting(formalGreetings, name);
}

export function friendlyGreeting(name) {
    return getRandomGreeting(friendlyGreetings, name);
}

export function creativeGreeting(name) {
    return getRandomGreeting(creativeGreetings, name);
}
