
let origins = [];
let onOriginChange = [];
let properties = [];

function testForms() {
    let totalSales = `
        let total = 0;
        this.itens.forEach(i => total += i.subtotal);
        total;
    `;

    origins.push({id: getBindId(), type: 'array', name: 'Products', value: JSON.stringify(products)});
    origins.push({id: getBindId(), type: 'array', name: 'Clients', value: JSON.stringify(clients)});
    origins.push({id: getBindId(), type: 'array', name: 'Sellers', value: JSON.stringify(sellers)});
    origins.push({id: getBindId(), type: 'script', name: 'Total Item', value: 'this.product.price * this.quantity'});
    origins.push({id: getBindId(), type: 'script', name: 'Total Sale', value: totalSales});
    
    properties.push(createProperty('client', 1, 1, true, origins[1].id));
    properties.push(createProperty('seller', 1, 1, true, origins[2].id));
    properties.push(createProperty('date', '2022/01/01', '2022/06/30'));
    let propItens = createProperty('itens', 1, 10);
    properties.push(propItens);
    propItens.subproperties.push(createProperty('product', 1, 1, true, origins[0].id));
    propItens.subproperties.push(createProperty('quantity', 1, 10));
    propItens.subproperties.push(createProperty('subtotal', 1, 1, true, origins[3].id));
    properties.push(createProperty('total', 1, 1, true, origins[4].id));

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
    for (let origin of origins) {
        if (origin.setData) {
            origin.setData();
        }
    }
    fireOnOriginChange();
}

function fireOnOriginChange() {
    for (let exec of onOriginChange) {
        exec();
    }
}

function createProperty(name, min, max, repeat = true, idOrigin = null, idProperty = '') {
    let prop = newProperty();
    prop.name = name;
    prop.min = min;
    prop.minType = parseMinMaxType(min);
    prop.max = max;
    prop.maxType = parseMinMaxType(max);
    prop.repeat = repeat;
    prop.idOrigin = idOrigin;
    prop.idProperty = idProperty;
    return prop;
}

function parseMinMaxType(mm) {
    if (!mm) {
        return 'number';
    }
    try {
        mm.split(/[-/]/).length > 1;
        return 'date';
    } catch (e) {
    }
    try {
        let isnumber = Number.parseInt(mm);
        if (isnumber && isnumber !== NaN) {
            return 'number';
        }
    } catch (e) {
    }
    return 'script';
}

function newProperty() {
    return {
        id: getBindId(),
        name: '',
        minType: 'number',
        min: 1,
        maxType: 'number',
        max: 1,
        repeat: true,
        idProperty: '',
        origin: '',
        subproperties: []
    };
}

function addProperty() {
    properties.push(newProperty());
    renderProperties();
}

function removeProperty(property) {
    if (!property) {
        return;
    }
    if (property.super) {
        removeSubproperty(property.super, property.id);
        return;
    }
    let newlist = properties.filter(p => p.id !== property.id);
    properties = newlist;
    renderProperties();
}

function renderProperties() {
    let html = '';
    for (let prop of properties) {
        html += propertyComp(prop);
    }
    document.getElementById('property-list').innerHTML = html;
    for (let prop of properties) {
        renderSubproperties(prop);
    }
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
    if (prop.subproperties && Array.isArray(prop.subproperties) && prop.subproperties.length > 0) {
        propval.origin = {};
        generateModel(propval.origin, prop.subproperties);
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
            return getDateStr(value);
        } catch(e) {
            return 1;
        }
    }
    return createOriginFunction(value);
}

function getDateStr(value) {
    return new Date(value.split(/[^0-9 ]/).map(str => str.trim()));
}

function getOriginValue(id) {
    if (!id) {
        return null;
    }
    let origin = origins.find(o => o.id == id);
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

function addSubproperty(property) {
    console.log('addSubproperty: ', property);
    if (!property) {
        return;
    }
    if (property.subproperties === undefined || property.subproperties === null) {
        console.log('Resetando subproperties');
        property.subproperties = [];
    }
    let subprop = newProperty();
    subprop.super = property;
    property.subproperties.push(subprop);
    console.log('added subproperty: ', property);
    renderSubproperties(property);
}

function removeSubproperty(property, idsub) {
    if (!property || !idsub) {
        return;
    }
    let newlist = property.subproperties.filter(sp => sp.id !== idsub);
    property.subproperties = newlist;
    renderSubproperties(property);
}

function renderSubproperties(property) {
    if (!property || !property.subproperties) {
        return;
    }
    let html = '';
    for (let subprop of property.subproperties) {
        html += propertyComp(subprop);
    }
    document.getElementById('list_' + property.id).innerHTML = html;
    fireOnOriginChange();
}

function renderOptions(options, selected) {
    if (!options || !Array.isArray(options)) {
        return '';
    }
    selected = selected ? selected : '';
    let html = '';
    for (let opt of options) {
        if (!opt || !opt.value || !opt.text) {
            continue;
        }
        html += `<option value="${opt.value}" ${opt.value === selected ? 'selected' : ''}>${opt.text}</option>`;
    }
    return html;
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
        if (value == iptSelect.options[i].value) {
            iptSelect.selectedIndex = i;
            return;
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

function writeInputText(id, value) {
    if (!id) {
        return;
    }
    let iptTxt = document.getElementById(id);
    if (!iptTxt) {
        return;
    }
    iptTxt.value = value;
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
