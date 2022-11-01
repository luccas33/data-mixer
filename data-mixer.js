
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

/*

"input" é o modelo a ser gerado

As propriedades devem ser geradas de acordo com um objeto contendo:
min: valor mínimo;
max: valor máximo;
origin: origem dos dados.

min e max podem ser um number, um Date ou um Function.
Caso min/max seja um Function, o Function é executado e o valor de retorno é usado como min/max.

origin pode ser null, um array, um objeto a ser gerado (modelo) ou um Function.
Caso origin seja null, será gerado um valor aleatório entre min e max;
Caso origin seja um array, um valor do array será selecionado aleatoriamente;
Caso origin seja um objeto modelo, o objeto é gerado e retornado para a propriedade em questão.
Caso origin seja um Funcion, o Funcion é executado e seu valor de retorno é enviado para a propriedade em questão.

Functions recebem o objeto que está sendo gerado como argumento.

Objetos modelos filhos recebem o objeto pai na propriedade super.

*/

let input = {
    client: {min: 1, max: 1, origin: clients},
    seller: {min: 1, max: 1, origin: sellers},
    date: {min: new Date(2022, 0, 1), max: new Date(2022, 05, 31)},
    itens: {min: 1, max: 10, 
        origin: {
            product: {min: 1, max: 1, origin: products},
            quantity: {min: 1, max: 10},
            subtotal: {origin: (obj) => obj.product.price * obj.quantity}
        }
    },
    paymentDate: {
        min: (obj) => obj.date, 
        max: new Date(2022, 06, 30)},
    total: {origin: (obj) => {
        let value = 0;
        obj.itens.forEach(i => value += i.subtotal);
        return value;
    }},
    paymentForms: {min: 1, max: 4},
    payments: {
        min: (obj) => obj.paymentForms,
        max: (obj) => obj.paymentForms,
        origin: {
            type: {origin: paymentTypes},
            value: {origin: (obj) => obj.super.total / obj.super.paymentForms}
        }
    }
}

function main() {
    for (let i = 0; i < 10; i++) {
        console.log(generate(input));
    }
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
        dest[key] = getValue(keyval, dest);
        return;
    }
    let qtd = random(keyval.min, keyval.max);
    qtd = qtd > 999 ? 999 : qtd;
    let values = [];
    for (let i = 0; i < qtd; i++) {
        values.push(getValue(keyval, dest));
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
    return {min: min, max: max, origin: keyval.origin, isDate: isDate};
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
