
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
        <div class="row origin-comp">
            <div class="col-1">
                <label>Name</label>
            </div>
            <div class="col-2">
                <input id="${idName}" value="${origin.name}" onkeyup="bind(${origin.id})">
            </div>
            <div class="col-1">
                <label>Type</label>
            </div>
            <div class="col-2">
                <select id="${idType}" onchange="bind(${origin.id})">
                    <option value="text" ${origin.type === 'text' ? 'selected' : ''}>Text ; separated</option>
                    <option value="array" ${origin.type === 'array' ? 'selected' : ''}>JSON Array</option>
                    <option value="script" ${origin.type === 'script' ? 'selected' : ''}>Javascript Code</option>
                </select>
            </div>
            <div class="col-1">
                <label>Data</label>
            </div>
            <div class="col-4">
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
        let html = '<option value="">Nenhuma</option>';
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
        property.min = readInputText(idMin);
        property.maxType = readSelect(idMaxType);
        property.max = readInputText(idMax);
        property.repeat = readCheckBox(idRepeat);
        property.idProperty = readInputText(idRepeatProp);
        property.idOrigin = readSelect(idSelectOrigin);
        property.origin = getOriginValue(property.idOrigin);
    };
    addBind(property.id, getProperty);

    return `
        <div class="row property-comp">
            <div class="col-12 row">
                <div class="col-1">
                    <label class="labelg">Name</label>
                </div>
                <div class="col-2">
                    <input id="${idName}" value="${property.name}" onkeyup="bind(${property.id})">
                </div>
            </div>
            <div class="col-12 row">
                <div class="col-1">
                    <label>Min Value</label>
                </div>
                <div class="col-2">
                    <input id="${idMin}" value="${property.min}" onkeyup="bind(${property.id})">
                </div>
                <div class="col-1">
                    <label>Type</label>
                </div>
                <div class="col-2">
                    <select id="${idMinType}" onchange="bind(${property.id})">
                        <option value="number" ${property.minType === 'number' ? 'selected' : ''}>Number</option>
                        <option value="date" ${property.minType === 'date' ? 'selected' : ''}>Date</option>
                        <option value="script" ${property.minType === 'script' ? 'selected' : ''}>Javascript code</option>
                    </select>
                </div>
                <div class="col-1">
                    <label>Max Value</label>
                </div>
                <div class="col-2">
                    <input id="${idMax}" value="${property.max}" onkeyup="bind(${property.id})">
                </div>
                <div class="col-1">
                    <label>Type</label>
                </div>
                <div class="col-2">
                    <select id="${idMaxType}" onchange="bind(${property.id})">
                        <option value="number" ${property.maxType === 'number' ? 'selected' : ''}>Number</option>
                        <option value="date" ${property.maxType === 'date' ? 'selected' : ''}>Date</option>
                        <option value="script" ${property.maxType === 'script' ? 'selected' : ''}>Javascript code</option>
                    </select>
                </div>
            </div>
            <div class="col-12 row">
                <div class="col-3">
                    <label>Can Repeat?</label>
                    <input class="ckb-repeat" type="checkbox" ${property.repeat ? 'checked' : ''} id="${idRepeat}" onclick="bind(${property.id})">
                </div>
                <div class="col-1">
                    <label>ID Property</label>
                </div>
                <div class="col-2">
                    <input id="${idRepeatProp}" value="${property.idProperty}">
                </div>
                <div class="col-1">
                    <label>Origin</label>
                </div>
                <div class="col-2">
                    <select id="${idSelectOrigin}" onchange="bind(${property.id})">
                    </select>
                </div>
                <div class="col-3">
                    <button onclick="removeProperty(${property.id})">Remove</button>
                </div>
            </div>
        </div>
    `;
}
