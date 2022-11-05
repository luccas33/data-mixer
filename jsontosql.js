
function runJsonToSql() {
    let json = document.getElementById('input-json').value;
    let tableName = document.getElementById('table-name').value.trim();
    let sql = jsonToSql(json, tableName);
    document.getElementById('output-sql').value = sql;
}

function jsonToSql(json, tableName) {
    if (!json) {
        return '';
    }
    tableName = tableName ? tableName : 'mytable';
    let obj;
    try {
        obj = JSON.parse(json);
    } catch (e) {
        console.log('Error parsing JSON: ', e);
        return '';
    }
    if (!obj) {
        return '';
    }
    if (Array.isArray(obj)) {
        let sql = '';
        for (let e of obj) {
            sql += objToSql(e, tableName);
            sql += '\n';
        }
        return sql;
    }
    return objToSql(obj, tableName);
}

function objToSql(obj, tableName = 'mytable') {
    if (!obj) {
        return '';
    }
    addSubObjsAsProps(obj);
    let keys = Object.keys(obj);
    if (keys.length === 0) {
        return '';
    }

    let simpleKeys = [];
    let objKeys = [];
    let arrayKeys = [];
    for (let key of keys) {
        let value = obj[key];
        if (Array.isArray(value)) {
            arrayKeys.push(key);
            continue;
        }
        if (!isSimpleType(value)) {
            objKeys.push(key);
            continue;
        }
        simpleKeys.push(key);
    }

    let sql = `insert into \`${tableName}\` (${simpleKeys.map(k => '`' + k + '`').join(', ')}) values (`;
    let values = simpleKeys.map(k => obj[k]);
    sql += values.map(v => getValue(v)).join(', ');
    sql += ');\n';
    for (let key of objKeys) {
        sql += objToSql(obj[key], key);
    }
    for (let key of arrayKeys) {
        let array = obj[key];
        for (let e of array) {
            sql += objToSql(e, key);
        }
    }
    return sql;
}

function addSubObjsAsProps(obj) {
    if (!obj || isSimpleType(obj) || Array.isArray(obj)) {
        return;
    }
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        if (isObjToAddKeys(value)) {
            addKeysToObj(value, obj, key + '_');
            delete obj[key];
        }
    }
}

function isObjToAddKeys(value) {
    if (!value) {
        return false;
    }
    if (isSimpleType(value)) {
        return false;
    }
    if (Array.isArray(value)) {
        return false;
    }
    for (let key of Object.keys(value)) {
        if (!isSimpleType(value[key])) {
            return false;
        }
    }
    return true;
}

function addKeysToObj(from, to, prefix) {
    if (!from || !to || !prefix) {
        return;
    }
    for (let key of Object.keys(from)) {
        to[prefix + key] = from[key];
    }
}

function isSimpleType(value) {
    if (!value) {
        return true;
    }
    if (typeof value === 'string') {
        return true;
    }
    if (value instanceof Date) {
        return true;
    }
    if (Array.isArray(value)) {
        return false;
    }
    if (Object.keys(value).length > 0) {
        return false;
    }
    return true;
}

function getValue(value) {
    if (!value) {
        return 'null';
    }
    if (value instanceof Date || typeof value === 'string') {
        return `'${value}'`;
    }
    value = value + '';
    if (!Number.isNaN(Number.parseFloat(value))) {
        return value;
    }
    if (value.toLowerCase().trim() === 'true') {
        return 'true';
    }
    if (value.toLowerCase().trim() === 'false') {
        return 'false';
    }
    return `'${value}'`;
}
