
let clients = ['João', 'Pedro', 'Maria', 'Betina', 'Mario'];
let sellers = ['Jucicleiton', 'Maylon', 'Jaira', 'Alex', 'Ariel'];

let products = [
    {name: 'Rice', price: 25},
    {name: 'Beans', price: 9},
    {name: 'Netbeans', price: 8},
    {name: 'Oil', price: 10},
    {name: 'Banana', price: 7},
    {name: 'Meat', price: 40}
];

let input = {
    client: {min: 1, max: 1, origin: clients},
    seller: {min: 1, max: 1, origin: sellers},
    date: {min: new Date(2022, 0, 1), max: new Date(2022, 05, 31)},
    itens: {min: 1, max: 10, 
        origin: {
            product: {min: 1, max: 1, origin: products},
            quantity: {min: 1, max: 10}
        }
    }
}

function main() {
    for (let i = 0; i < 10; i++) {
        console.log(generate(input));
    }
}

function generate(origin) {
    if (!origin) {
        return null;
    }
    let dest = {};
    for (let key of Object.keys(origin)) {
        generateItem(origin, dest, key);
    }
    return dest;
}

function generateItem(origin, dest, key) {
    if (!origin || !dest || !key) {
        return;
    }
    let keyval = origin[key];
    if (!keyval) {
        return;
    }
    keyval = validateMinMax(keyval);
    if (keyval.max === 1 || !keyval.origin) {
        dest[key] = getValue(keyval);
        return;
    }
    let qtd = random(keyval.min, keyval.max);
    qtd = qtd > 999 ? 999 : qtd;
    let values = [];
    for (let i = 0; i < qtd; i++) {
        values.push(getValue(keyval));
    }
    dest[key] = values;
}

function validateMinMax(keyval) {
    let min = keyval.min;
    min = !min ? 1 : min;
    min = min instanceof Date ? min.getTime() : min;
    min = !min || min < 1 ? 1 : min;
    let max = keyval.max;
    max = !max ? min : max;
    max = max instanceof Date ? max.getTime() : max;
    max = max < min ? min : max;
    let isDate = keyval.min instanceof Date || keyval.max instanceof Date;
    return {min: min, max: max, origin: keyval.origin, isDate: isDate};
}

function getValue(keyval) {
    let value;
    if (!keyval.origin) {
        value = random(keyval.min, keyval.max);
        if (keyval.isDate) {
            let dt = new Date();
            dt.setTime(value);
            return dt;
        }
        return value;
    }
    if (Array.isArray(keyval.origin)) {
        return keyval.origin[random(0, keyval.origin.length -1)];
    }
    return generate(keyval.origin);
}

function random(min, max) {
    max++;
    return Math.floor(Math.random() * (max - min)) + min;
}
