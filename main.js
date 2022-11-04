
let origins = [];
let onOriginChange = [];
let properties = [];

function testForms() {
    origins.push({id: getBindId(), type: 'text', name: 'Origin 1', value: 'a; b; c; d; d; e'});
    origins.push({id: getBindId(), type: 'array', name: 'Origin 2', value: '[1, 2, 3, 4, 5]'});
    origins.push({id: getBindId(), type: 'script', name: 'Origin 3', value: '(this.prop1 * this.prop3) + \' letters \' + this.prop2'});
    
    properties.push({
        id: getBindId(),
        name: 'prop1',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 5,
        repeat: false,
        idProperty: '',
        origin: ''
    });
    properties.push({
        id: getBindId(),
        name: 'prop2',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 1,
        repeat: true,
        idProperty: '',
        origin: '',
        idOrigin: origins[0].id
    });
    properties.push({
        id: getBindId(),
        name: 'prop3',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 1,
        repeat: true,
        idProperty: '',
        origin: '',
        idOrigin: origins[1].id
    });
    properties.push({
        id: getBindId(),
        name: 'prop4',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 1,
        repeat: true,
        idProperty: '',
        origin: '',
        idOrigin: origins[2].id
    });

    renderOrigins();
    renderProperties();
}

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

function removeProperty(id) {
    let newlist = properties.filter(p => p.id !== id);
    properties = newlist;
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

function generateForms() {
    let model = generateModel({}, properties);
    let data = generate(model);
    let value = 'Generated Data:\n\n';
    value += JSON.stringify(data, null, 4);
    document.getElementById('output').value = value;
}

function generateModel(model, propertyList) {
    for (let prop of propertyList) {
        model[prop.name] = generateProperty(prop);
    }
    return model;
}

function generateProperty(prop) {
    let propval = {};
    propval.min = getMinMax(prop.min, prop.minType);
    propval.max = getMinMax(prop.max, prop.maxType);
    propval.repeat = prop.repeat;
    propval.idProperty = prop.idProperty;
    if (prop.subproperties && Array.isArray(prop.subproperties)) {
        propval.origin = {};
        generateModel(propval.origin, propval.subproperties);
        return propval;
    }
    propval.origin = getOriginValue(prop.idOrigin);
    return propval;
}

function getMinMax(value, type) {
    if (!value || !type) {
        return null;
    }
    if (type === 'number') {
        try {
        return Number.parseInt(value);
        } catch (e) {
            return 1;
        }
    }
    if (type === 'date') {
        try {
            return new Date(value.split(/[^0-9 ]/).map(str => str.trim()));
        } catch(e) {
            return 1;
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
