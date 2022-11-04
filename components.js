
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

    origin.setData = () => {
        writeInputText(idValue, origin.value);
    };

    let typeOptions = [
        {value: 'text', text: 'Text ; separated'},
        {value: 'array', text: 'JSON Array'},
        {value: 'script', text: 'Javascript Code'}
    ];

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
                    ${renderOptions(typeOptions, origin.type)}
                </select>
            </div>
            <div class="col-1">
                <label>Data</label>
            </div>
            <div class="col-4">
                <input id="${idValue}" onkeyup="bind(${origin.id})">
            </div>
            <div class="btn-remove col-1"><button type="button" class="btn btn-primary" onclick="removeOrigin(${origin.id})">Remove</button></div>
        </div>
    `;
}

function propertyComp(property) {
    if (!property || !property.id) {
        return '';
    }

    let idSelectOrigin = getBindId();
    let renderOriginOptions = () => {
        let html = '<option value="">None</option>';
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

    let idRemove = getBindId();
    let remove = () => {
        removeProperty(property);
    };
    addBind(idRemove, remove);

    let idAddSubprop = getBindId();
    let addSubprop = () => {
        addSubproperty(property);
    };
    addBind(idAddSubprop, addSubprop);

    let typeOptions = [
        {value: 'number', text: 'Number'},
        {value: 'date', text: 'Date'},
        {value: 'script', text: 'Javascript Code'}
    ];

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
                        ${renderOptions(typeOptions, property.minType)}
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
                        ${renderOptions(typeOptions, property.maxType)}
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
                    <input id="${idRepeatProp}" value="${property.idProperty}" onchange="bind(${property.id})">
                </div>
                <div class="col-1">
                    <label>Origin</label>
                </div>
                <div class="col-2">
                    <select id="${idSelectOrigin}" onchange="bind(${property.id})">
                    </select>
                </div>
                <div class="col-3">
                    <button type="button" class="btn btn-primary" class="btn-remove" onclick="bind(${idRemove})">Remove</button>
                </div>
            </div>
            <div class="col-12">
                <button type="button" class="btn btn-primary" onclick="bind(${idAddSubprop})">Add Subproperty</button>
            </div>
            <div id="list_${property.id}" class="subproperties">

            </div>
        </div>
    `;
}
