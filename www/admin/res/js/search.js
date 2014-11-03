var lockSearch = false;

function showSearchOptions() {
    var wrapper = document.getElementById("search-form");
    var p = document.getElementById("search-options-title");
    var table = document.getElementById("advanced-search-options");

    if (wrapper.style.height == "40px" || wrapper.style.height == "") {
        wrapper.style.height = 80 + p.offsetHeight + table.clientHeight + "px";}
    else
        wrapper.style.height = "40px";
}

function search() {
    var query = document.getElementById("search_input").value;
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
    // Nettoyage de la recherche précédente
    while (wrap.firstChild) { wrap.removeChild(wrap.firstChild) };

    // On cache la boite de dialogue d'ajout de document
    try {
        var mainWrapper = document.getElementsByClassName('wrapper')[0]
        var addDoc = document.getElementById("add_document_box");
        mainWrapper.removeChild(addDoc);
    } catch (e) {}

    if (query.length == "") {
        insertNewDocButton();
    }
    else if (query.length < 3) {
        var p = document.createElement('p');
        p.innerHTML = "La recherche doit contenir au moins 3 caractères !";
        p.style.fontSize = "30px";
        p.style.color = "#c34747";
        p.style.textAlign = "center";
        wrap.appendChild(p);
    }
    else {
        // On implémente un verrou pour éviter une double requête
        if (lockSearch) return 1;
        else toggleLock();

        // On implémente le responsive
        var body = document.getElementsByTagName('body')[0];
        body.setAttribute("onresize", "setBoxWrapperSize()");

        // Onrécupère les options de recherche
        var searchDatasheet = document.getElementById('datasheet').checked;
        var searchWiki = document.getElementById('wiki').checked;
        var searchTuto = document.getElementById('tuto').checked;

        var icon = document.getElementsByClassName("search-icon")[0];
        icon.className = "search-icon-spinner search-icon-spinner-top";

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'db/proceed.php?search=' + query
                + "&datasheet=" + searchDatasheet
                + "&wiki=" + searchWiki
                + "&tuto=" + searchTuto, true);
        xhr.onload = function () {
            var result = JSON.parse(this.responseText);
            for (var i = 0 ; i < result.length ; i++) {
                fireTimeout(result[i], i);
            }
            if (result.length == 0) {
                body.removeAttribute("onresize");
                var p = document.createElement('p');
                p.innerHTML = "Aucun résultat !";
                p.style.fontSize = "30px";
                p.style.color = "#c34747";
                p.style.textAlign = "center";
                wrap.appendChild(p);
            }
            icon.className = "search-icon";

            // On enlève le verrou
            setTimeout(toggleLock, result.length * 100);
        };
        xhr.send();
    }
}

function fireTimeout(r, i) {
    setTimeout(function () {insertSearchResult(r);}, (i*100));
}

function toggleLock() {
    lockSearch = !lockSearch;
}

function sendNewDocument() {
    var wrap = document.getElementById('add_document_box');
    // Nettoyage ddu contenu du node
    while (wrap.firstChild) { wrap.removeChild(wrap.firstChild) };

    var processIcon = document.createElement('i');
    processIcon.className = "search-icon-spinner search-big-icon";

    var caption = document.createElement('p');
    caption.className = "section-title";
    caption.innerHTML = "Ajout en cours...";

    wrap.style.textAlign = "center";
    wrap.appendChild(processIcon);
    wrap.appendChild(caption);

    return true;
}

function insertNewDocForm(e) {
    var wrapper = document.getElementsByClassName("wrapper")[0];
    var wrap = document.getElementById("add_document_box");
    // Nettoyage ddu contenu du node
    while (wrap.firstChild) { wrap.removeChild(wrap.firstChild) };
    wrap.style.textAlign = "";

    var form = document.createElement('form');
    form.setAttribute("action", "db/upload.php");
    form.setAttribute("method", "POST");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("onsubmit", "return sendNewDocument();");

    // Champs du titre
    var fieldTitle = createInput("title", "text", "Titre : ", true, 16);

    // Champs du sous-titre
    var fieldSubtitle = createInput("subtitle", "text", "Sous-titre : ", true);

    // Champs du type
    var labelType = document.createElement('label');
    labelType.innerHTML = "Type : ";
    labelType.setAttribute("for", "type");
    var inputType = document.createElement('select');
    inputType.id = "type";
    inputType.name = "type";

    var datasheet = document.createElement('option');
    datasheet.innerHTML = "Datasheet";
    var tuto = document.createElement('option');
    tuto.innerHTML = "Tutoriel";
    var wiki = document.createElement('option');
    wiki.innerHTML = "Wiki";

    inputType.appendChild(datasheet);
    inputType.appendChild(tuto);
    inputType.appendChild(wiki);

    inputType.setAttribute("required", "");
    labelType.appendChild(inputType);

    // Champs du fichier
    var fieldFile = createInput("file", "file", "Fichier : ", true);

    // Champs des tags
    var fieldTags = createInput("tags", "text", "Tags : ", false, 255);

    // Form button
    var button = document.createElement('button');
    button.className = "submit_button";
    button.value = "submit";
    button.innerHTML = "Envoyer";

    // Assemblage
    form.appendChild(fieldTitle);
    form.appendChild(document.createElement('br'));
    form.appendChild(fieldSubtitle);
    form.appendChild(document.createElement('br'));
    form.appendChild(labelType);
    form.appendChild(document.createElement('br'));
    form.appendChild(fieldFile);
    form.appendChild(document.createElement('br'));
    form.appendChild(fieldTags);
    form.appendChild(button);

    wrap.appendChild(form);
    wrapper.appendChild(wrap);
}

function createInput(name, type, labelText, required, maxlength) {
    var label = document.createElement('label');
    label.innerHTML = labelText;

    label.setAttribute("for", name);
    var input = document.createElement('input');
    input.id = name;
    input.name = name;
    input.type = type;
    if (name == "file") input.style.textAlign = "right";
    if (required) input.setAttribute("required", "");
    if (maxlength) input.setAttribute("maxlength", maxlength);
    label.appendChild(input);

    return label;
}

function insertNewDocButton() {
    var wrapper = document.getElementsByClassName("wrapper")[0];

    var a = document.createElement('a');
    var div = document.createElement('div');
    var i = document.createElement('i');
    var p = document.createElement('p');

    p.className = "section-title";
    p.innerHTML = "Ajouter un document";
    i.className = "search-icon-upload search-big-icon";
    a.appendChild(i);
    a.appendChild(p);
    a.href = "#";
    a.setAttribute("onclick", "insertNewDocForm(this)");

    div.id = "add_document_box";
    div.style.textAlign = "center";
    div.appendChild(a);
    wrapper.appendChild(div);
}
