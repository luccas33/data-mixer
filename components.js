
function originComp(origin) {
    if (!origin || !origin.id) {
        return '';
    }

    let idName = getBindId();
    let idType = getBindId();
    let idValue = getBindId();

    let getOrigin = () => {
        origin.name = readInputText(idName);
        origin.type = readSelect(idType);
        origin.value = readInputText(idValue);
        fireOnOriginChange();
    };
    addBind(origin.id, getOrigin);

    return `
        <div class="origin-comp row">
            <div class="name col-3">
                <label>Nome</label>
                <input id="${idName}" value="${origin.name}" onkeyup="bind(${origin.id})">
            </div>
            <div class="type col-3">
                <label>Tipo</label>
                <select id="${idType}" onchange="bind(${origin.id})">
                    <option value="text" ${origin.type === 'text' ? 'selected' : ''}>Text ; separated</option>
                    <option value="array" ${origin.type === 'array' ? 'selected' : ''}>JSON Array</option>
                    <option value="script" ${origin.type === 'script' ? 'selected' : ''}>Javascript Code</option>
                </select>
            </div>
            <div class="value col-5">
                <label>Dado</label>
                <input id="${idValue}" value="${origin.value}" onkeyup="bind(${origin.id})">
            </div>
            <div class="btn-remove col-1"><button onclick="removeOrigin(${origin.id})">Remove</button></div>
        </div>
    `;
}

function propertyComp(property) {
    if (!property || !property.id) {
        return '';
    }

    let idSelectOrigin = getBindId();
    let renderOriginOptions = () => {
        let html = '<option value="">Nenhum</option>';
        for (let origin of origins) {
            html += `<option value="${origin.id}">${origin.name}</option>`;
        }
        let iptSelect = document.getElementById(idSelectOrigin);
        if (!iptSelect) {
            return;
        }
        iptSelect.innerHTML = html;
        writeSelect(idSelectOrigin, property.idOrigin);
    };
    onOriginChange.push(renderOriginOptions);

    let idName = getBindId();
    let idMin = getBindId();
    let idMinType = getBindId();
    let idMax = getBindId();
    let idMaxType = getBindId();
    let idRepeat = getBindId();
    let idRepeatProp = getBindId();

    let getProperty = () => {
        property.name = readInputText(idName);
        property.minType = readSelect(idMinType);
        property.min = getMinMax(idMin, property.minType);
        property.maxType = readSelect(idMaxType);
        property.max = getMinMax(idMax, property.maxType);
        property.repeat = readCheckBox(idRepeat);
        property.idProperty = readInputText(idRepeatProp);
        property.idOrigin = readSelect(idSelectOrigin);
        property.origin = getOriginValue(property.idOrigin);
    };
    addBind(property.id, getProperty);

    return `
        <div class="property-comp row">
            <div class="name col-3">
                <label>Nome</label>
                <input id="${idName}" value="${property.name}" onkeyup="bind(${property.id})">
            </div>
            <div class="prop-min">
                <label>Valor Mínimo</label>
                <input id="${idMin}" onkeyup="bind(${property.id})">
                <label>tipo</label>
                <select id="${idMinType}" onchange="bind(${property.id})">
                    <option value="number" ${property.minType === 'number' ? 'selected' : ''}>Number</option>
                    <option value="date" ${property.minType === 'date' ? 'selected' : ''}>Date</option>
                    <option value="script" ${property.minType === 'script' ? 'selected' : ''}>Javascript code</option>
                </select>
            </div>
            <div class="prop-max">
                <label>Valor Máximo</label>
                <input id="${idMax}" onkeyup="bind(${property.id})">
                <label>tipo</label>
                <select id="${idMaxType}" onchange="bind(${property.id})">
                    <option value="number" ${property.maxType === 'number' ? 'selected' : ''}>Number</option>
                    <option value="date" ${property.maxType === 'date' ? 'selected' : ''}>Date</option>
                    <option value="script" ${property.maxType === 'script' ? 'selected' : ''}>Javascript code</option>
                </select>
            </div>
            <div class="prop-repeat">
                <label>Pode Repetir?</label>
                <input type="checkbox" id="${idRepeat}" onclick="bind(${property.id})">
                <label>Propriedade única</label>
                <input id="${idRepeatProp}">
            </div>
            <div class="prop-origin">
                <label>Origem</label>
                <select id="${idSelectOrigin}" onchange="bind(${property.id})">
                </select>
            </div>
        </div>
    `;
}
