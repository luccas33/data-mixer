
let origins = [];
let onOriginChange = [];
let properties = [];

function addOrigin() {
    origins.push({id: getBindId(), type: 'text', name: '', value: ''});
    renderOrigins();
}

function removeOrigin(id) {
    let newlist = origins.filter(o => o.id !== id);
    origins = newlist;
    renderOrigins();
}

function renderOrigins() {
    let html = '';
    for (let origin of origins) {
        html += originComp(origin);
    }
    document.getElementById('origins-list').innerHTML = html;
    fireOnOriginChange();
}

function fireOnOriginChange() {
    for (let exec of onOriginChange) {
        exec();
    }
}

function addProperty() {
    properties.push({
        id: getBindId(),
        name: '',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 1,
        repeat: true,
        idProperty: '',
        origin: ''
    });
    renderProperties();
}

function renderProperties() {
    let html = '';
    for (let prop of properties) {
        html += propertyComp(prop);
    }
    document.getElementById('property-list').innerHTML = html;
    fireOnOriginChange();
}

function getMinMax(idValue, type) {
    if (!idValue || !type) {
        return null;
    }
    let value = readInputText(idValue);
    if (!value) {
        return null;
    }
    if (!type) {
        return null;
    }
    if (type === 'number') {
        return Number.parseInt(value);
    }
    if (type === 'date') {
        try {
            return new Date(value.split(/[^0-9 ]/).map(str => str.trim()));
        } catch(e) {
            return null;
        }
    }
    return createOriginFunction(value);
}

function getOriginValue(id) {
    if (!id) {
        return null;
    }
    let origin = origins.find(o => o.id === id);
    if (!origin || !origin.value) {
        return null;
    }
    if (origin.type === 'text') {
        return origin.value.split(';').map(str => str.trim());
    }
    if (origin.type === 'array') {
        return JSON.parse(origin.value);
    }
    if (origin.type === 'script') {
        return createOriginFunction(origin.value);
    }
    return null;
}

function createOriginFunction(script) {
    return (obj) => {
        return function() { return eval(script)}.call(obj);
    }
}

function readCheckBox(id) {
    if (!id) {
        return null;
    }
    let checkbox = document.getElementById(id);
    if (!checkbox) {
        return null;
    }
    return checkbox.checked;
}

function readSelect(id) {
    if (!id) {
        return null;
    }
    let iptSelect = document.getElementById(id);
    if (!iptSelect) {
        return null;
    }
    let selected = iptSelect.options[iptSelect.selectedIndex];
    if (!selected) {
        return null;
    }
    return selected.value;
}

function writeSelect(id, value) {
    if (!id) {
        return;
    }
    let iptSelect = document.getElementById(id);
    if (!iptSelect) {
        return;
    }
    if (!value) {
        iptSelect.selectedIndex = -1;
        return;
    }
    for (let i = 0; i < iptSelect.options.length; i++) {
        if (value === iptSelect[i].value) {
            iptSelect.selectedIndex = i;
            break;
        }
    }
}

function readInputText(id) {
    if (!id) {
        return '';
    }
    let iptTxt = document.getElementById(id);
    if (!iptTxt) {
        return '';
    }
    return iptTxt.value;
}

let binds = [];
let bindId = 1;

function getBindId() {
    bindId++;
    return bindId;
}

function addBind(id, func) {
    if (!id || !func) {
        return;
    }
    let bindsOfId = binds.find(b => b.id === id);
    if (!bindsOfId) {
        bindsOfId = {id: id, functions: []};
        binds.push(bindsOfId);
    }
    bindsOfId.functions.push(func);
}

function bind(id) {
    if (!id) {
        return;
    }
    let bind = binds.find(b => b.id === id);
    if (bind) {
        bind.functions.forEach(func => func());
    }
}
