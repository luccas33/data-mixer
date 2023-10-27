
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

let paymentTypes = ['Cash', 'Credit Card', 'Debit Card', 'Billet'];

let input = {
    client: {min: 1, max: 1, origin: clients},
    seller: {min: 1, max: 1, origin: sellers},
    date: {min: new Date(2022, 0, 1), max: new Date(2022, 5, 31)},
    itens: {min: 1, max: 10, 
        origin: {
            product: {min: 1, max: 1, origin: products},
            quantity: {min: 1, max: 10},
            subtotal: {origin: (obj) => obj.product.price * obj.quantity}
        }
    },
    paymentDate: {
        min: (obj) => obj.date, 
        max: new Date(2022, 6, 30)},
    total: {origin: (obj) => {
        let value = 0;
        obj.itens.forEach(i => value += i.subtotal);
        return value;
    }},
    paymentForms: {min: 1, max: 4},
    payments: {
        min: (obj) => obj.paymentForms,
        max: (obj) => obj.paymentForms,
        repeat: false,
        idProperty: 'type',
        origin: {
            type: {origin: paymentTypes},
            value: {origin: (obj) => obj.super.total / obj.super.paymentForms}
        }
    }
}

let generatedData = [];
function main() {
    generatedData = [];
    for (let i = 0; i < 10; i++) {
        generatedData.push(generate(input));
    }
    console.log(generatedData);
}

function generate(origin, superDest = null) {
    if (!origin) {
        return null;
    }
    let dest = {super: superDest};
    for (let key of Object.keys(origin)) {
        generateItem(origin, dest, key);
    }
    delete dest.super;
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
    keyval = validateMinMax(keyval, dest);
    if (keyval.max === 1 || !keyval.origin) {
        let value = getValue(keyval, dest);
        value = keyval.converter ? keyval.converter(value) : value;
        dest[key] = value;
        return;
    }
    let qtd = random(keyval.min, keyval.max);
    qtd = qtd > 999 ? 999 : qtd;
    let values = [];
    let repeated = 0;
    for (let i = 0; i < qtd; i++) {
        let value = getValue(keyval, dest);
        value = keyval.converter ? keyval.converter(value) : value;
        if (repeated > 999) {
            keyval.repeat = true;
        }
        if (!keyval.repeat && values.indexOf(value) > -1) {
            i--;
            repeated++;
            continue;
        }
        if (!keyval.repeat && keyval.idProperty) {
            let ids = values.map(v => v[keyval.idProperty]);
            if (ids.indexOf(value[keyval.idProperty]) > -1) {
                i--;
                repeated++;
                continue;
            }
        }
        values.push(value);
    }
    dest[key] = values;
}

function validateMinMax(keyval, dest) {
    let min = keyval.min;
    if (min instanceof Function) {
        min = min(dest);
    }
    min = !min ? 1 : min;
    min = min instanceof Date ? min.getTime() : min;
    min = !min || min < 1 ? 1 : min;
    let max = keyval.max;
    if (max instanceof Function) {
        max = max(dest);
    }
    max = !max ? min : max;
    max = max instanceof Date ? max.getTime() : max;
    max = max < min ? min : max;
    let isDate = keyval.min instanceof Date || keyval.max instanceof Date;
    let converter = keyval.converter && keyval.converter instanceof Function ? keyval.converter : null;
    return {min, max, isDate, origin: keyval.origin, repeat: keyval.repeat, idProperty: keyval.idProperty, converter};
}

function getValue(keyval, dest) {
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
    if (keyval.origin instanceof Function) {
        return keyval.origin(dest);
    }
    return generate(keyval.origin, dest);
}

function random(min, max) {
    max++;
    return Math.floor(Math.random() * (max - min)) + min;
}

function datetimeToString(date) {
    if (!date || !(date instanceof Date)) {
        return null;
    }
    return `${dateToString(date)} ${timeToString(date)}`;
}

function dateToString(date) {
    if (!date || !(date instanceof Date)) {
        return null;
    }
    return `${date.getFullYear()}-${complete(date.getMonth() + 1)}-${complete(date.getDate())}`;
}

function timeToString(date) {
    if (!date || !(date instanceof Date)) {
        return null;
    }
    return `${complete(date.getHours())}:${complete(date.getMinutes())}:${complete(date.getSeconds())}`;
}

function complete(value, char = '0', qtt = 2) {
    value = value + '';
    char = char.length === 0 ? '0' : char;
    while (value.length < qtt) {
        value = char + value;
    }
    return value;
}

function round(value = 0, dec = 2) {
    let factor = Math.pow(10, dec);
    return Math.round(value * factor) / factor;
}
