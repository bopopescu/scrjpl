var resizeTimer = 0;
var maxTdId = 0;
var currentPopup;

var daarrtList = new Array();
var REFRESH_RATE = 5000;

// Bloque la fonction fireResize jusqu'a la fin du redimensionnement
function setBoxWrapperSize() {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fireResize, 200);
}

// Adapte les box en fonction de la taille de la fenêtre
function fireResize() {
    var container = document.getElementsByClassName("item-zone")[0];
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];;
    var boxes = document.getElementsByClassName("ib");
    var box = window.getComputedStyle(boxes[0]);

    var n; var p;

    /* Choix des coeffs de redimensionnement
     * n : nbr par colonne
     * p : taille d'une box en %
     */
    if (container.clientWidth < 480) { n = 1;p = 0.91; }
    else if (container.clientWidth < 605) { n = 1; p = 0.93; }
    else if (container.clientWidth < 780) { n = 2; p = 0.46; }
    else if (container.clientWidth < 1000) { n = 2; p = 0.47; }
    else { n = 3; p = 0.31; }

    wrap.style.width = n * (p * container.clientWidth
            + 2 * parseInt(box.getPropertyValue('margin-right')));

    for (var i = 0 ; i < boxes.length ; i++) {
        boxes[i].style.width = p * 100 + "%";
    }

    relocatePopup();

    wrap.style.margin = "10px auto";
}

function showEditOptions(e) {
    e.getElementsByClassName("ib-edit")[0].style.opacity = "1";
}

function hideEditOptions(e) {
    e.getElementsByClassName("ib-edit")[0].style.opacity = "0";
}

// Génère une box "DAARRT" avec les liens vers la console, webcam, etc, ...
function insertDaarrt(json) {
    var daarrt = JSON.parse(json);

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    var daarrtBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    daarrtBox.className = "ib";
    daarrtBox.id = "daarrt-" + daarrt.id;
    options.className = "ib-options";
    title.className = (daarrt.name.length < 10) ? "ib-title-short" : "ib-title-long";
    subtitle.className = "ib-subtitle";

    subtitle.innerHTML += daarrt.groups + ((daarrt.groups <= 1) ? " groupe" : " groupes");
    title.innerHTML += daarrt.name + "<br/>";

    // OPTIONS DU DAARRT (console, webcam, ...)

    var iTitle = document.createElement('i');
    var iView = document.createElement('i');
    var iConsole = document.createElement('i');
    var iDetail = document.createElement('i');

    iTitle.className = "ib-title-icon daarrt-box-title-icon";
    iView.className = "daarrt-box-icon-view";
    iConsole.className = "daarrt-box-icon-ssh";
    iDetail.className = "daarrt-box-icon-detail";

    var aView = document.createElement('a');
    var aConsole = document.createElement('a');
    var aDetail = document.createElement('a');

    aView.setAttribute('href', 'daarrt/view.php?id=' + daarrt.id);
    aConsole.setAttribute('href', 'daarrt/shell.php?id=' + daarrt.id);
    aDetail.setAttribute('href', 'daarrt/details.php?id=' + daarrt.id);

    // Assemblage des éléments de la box

    aView.appendChild(iView);
    aView.innerHTML += " Voir";
    aConsole.appendChild(iConsole);
    aConsole.innerHTML += " Console";
    aDetail.appendChild(iDetail);
    aDetail.innerHTML += " Détails";

    options.appendChild(aView);
    options.innerHTML += " | ";
    options.appendChild(aConsole);
    options.innerHTML += " | ";
    options.appendChild(aDetail);

    daarrtBox.appendChild(iTitle);
    daarrtBox.appendChild(title);
    daarrtBox.appendChild(subtitle);
    daarrtBox.appendChild(options);

    wrapper.appendChild(daarrtBox);
    daarrtList.push(daarrt.id);
    fireResize();
}

// Ajoute une box DAARRT et création d'un message d'info signalant le nouveau DAARRT.
function insertNewDaarrt(name, el) {
    insertDaarrt(el);
    insertBox(name + " vient de se connecter", "info");
}

function checkNewDaarrt() {
    var data = new FormData();

    data.append('daarrts', JSON.stringify(daarrtList));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/db/proceed.php?daarrts=update', true);
    xhr.onload = function () {
        if (this.responseText == "ERROR") {
            insertBox("Impossible de mettre à jour la liste des DAARRT", "error");
        }
        else {
            var add = JSON.parse(this.responseText.split("||")[0]);
            var remove = JSON.parse(this.responseText.split("||")[1]);

            var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
            for (var i = 0 ; i < remove.length ; i++) {
                el = remove[i];
                wrapper.removeChild(document.getElementById("daarrt-" + remove[i]));
                insertBox("Le DAARRT " + remove[i] + " vient de se déconnecter.", "info");
                var index = daarrtList.indexOf(remove[i]);
                if (index > -1) daarrtList.splice(index, 1);
            }

            for (var i = 0 ; i < add.length ; i++) {
                setNewDaarrtDelay(add[i], i * 100);
            }

        }
        setTimeout(checkNewDaarrt, REFRESH_RATE);
    };
    xhr.send(data);
}

function setNewDaarrtDelay(el, time) {
    setTimeout(function () {insertNewDaarrt(el.name, JSON.stringify(el));}, time);
}

/*
 * Fonction spécifiques au box de TD.
 */

function insertTd(id, titre, sujet, eno, res, cor) {
    maxTdId = Math.max(id, maxTdId);

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];;
    var tdBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');

    tdBox.setAttribute("onmouseover", "showEditOptions(this)");
    tdBox.setAttribute("onmouseout", "hideEditOptions(this)");

    tdBox.id = id;
    tdBox.className = "ib";
    options.className = "ib-options td-box-options";
    title.className = (titre.length < 10) ? "ib-title-short" : "ib-title-long";
    subtitle.className = "ib-subtitle";

    title.innerHTML += titre;
    subtitle.innerHTML += sujet;

    // OPTIONS D'EDITION
    var edit = document.createElement('div');
    var aEdit = document.createElement('a');
    var aDel = document.createElement('a');
    var iEdit = document.createElement('i');
    var iDel = document.createElement('i');

    aEdit.setAttribute('onclick', 'editInPlace(' + id + ')');
    aEdit.setAttribute("href", "#");
    aDel.setAttribute('onclick', 'deleteInPlace(' + id + ')');
    aDel.setAttribute("href", "#");

    edit.className = "ib-edit";
    iEdit.className = "icon-modify"
    iDel.className = "icon-delete"

    aEdit.appendChild(iEdit);
    aDel.appendChild(iDel);
    edit.appendChild(aEdit);
    edit.appendChild(aDel);

    // OPTIONS UTILISATEUR (Enoncé, Ressources, Correction)
    var iTitle = document.createElement('i');
    var iEno = document.createElement('i');
    var iRes = document.createElement('i');
    var iCor = document.createElement('i');

    iTitle.className = "ib-title-icon td-box-title-icon";
    iEno.className = "td-box-icon-eno";
    iRes.className = "td-box-icon-res";
    iCor.className = "td-box-icon-cor";

    var aEno = document.createElement('a');
    var aRes = document.createElement('a');
    var aCor = document.createElement('a');

    aEno.setAttribute('href', (eno) ? eno : '#');
    if (eno) aEno.setAttribute('target', '_blank');
    aRes.setAttribute('href', (res) ? res : '#');
    if (res) aRes.setAttribute('target', '_blank');
    aCor.setAttribute('href', (cor) ? cor : '#');
    if (cor) aCor.setAttribute('target', '_blank');

    iEno.className += (eno) ? " td-box-green-icon" : " td-box-red-icon";
    iRes.className += (res) ? " td-box-green-icon" : " td-box-red-icon";
    iCor.className += (cor) ? " td-box-green-icon" : " td-box-red-icon";

    aEno.appendChild(iEno);
    aEno.innerHTML += " Enoncé";
    aRes.appendChild(iRes);
    aRes.innerHTML += " Ressources";
    aCor.appendChild(iCor);
    aCor.innerHTML += " Correction";

    options.appendChild(aEno);
    options.innerHTML += " | ";
    options.appendChild(aRes);
    options.innerHTML += " | ";
    options.appendChild(aCor);

    tdBox.appendChild(iTitle);
    tdBox.appendChild(title);
    tdBox.insertBefore(document.createElement('br'), tdBox.children[2]);
    tdBox.appendChild(subtitle);
    tdBox.appendChild(edit);
    tdBox.appendChild(options);

    wrapper.appendChild(tdBox);
    fireResize();
}

function insertNewTd() {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    wrapper.removeChild(wrapper.lastChild);
    insertTd(++maxTdId, "TD " + maxTdId, "Sujet du TD " + maxTdId, 0, 0, 0);
    setTimeout(insertAddTdItem, 100);
}

function insertAddTdItem() {

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    var addTdBox = document.createElement('div');
    var a = document.createElement('a');
    var i = document.createElement('i');

    a.setAttribute("href", "javascript:insertNewTd()");

    addTdBox.id = "add-td-box";
    addTdBox.className = "ib";

    a.appendChild(i);
    addTdBox.appendChild(a);
    wrapper.appendChild(addTdBox);
    fireResize();
}

function editInPlace(id) {
    var box = document.getElementById(id);
    var title = box.children[1];
    var subtitle = box.children[3];

    var inputTitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.value = title.innerHTML;
    inputTitle.className = "ib-edit-title";
    box.insertBefore(inputTitle, box.children[1]);
    box.removeChild(title);

    var inputSubtitle = document.createElement('input');
    inputSubtitle.type = "text";
    inputSubtitle.value = subtitle.innerHTML;
    inputSubtitle.className = "ib-edit-subtitle";
    box.insertBefore(inputSubtitle, box.children[3]);
    box.removeChild(subtitle);

    var editOptions = box.getElementsByClassName("ib-edit")[0];
    editOptions.removeChild(editOptions.firstChild);
    editOptions.firstChild.firstChild.className = "icon-save";
    editOptions.firstChild.setAttribute("onclick", "saveInPlace(" + id + ")");

    var userOptions = box.getElementsByClassName("ib-options")[0];
    for (var i = 0 ; i < userOptions.children.length ; i++) {
        var el = userOptions.children[i];
        el.setAttribute("onclick", "return showPopUp(" + id + ", " + i + ")");
    }
}

function showPopUp(id, i, text) {
    var body = document.getElementsByTagName("body")[0];
    try { body.removeChild(currentPopup); } catch (e) {}


    var box = document.getElementById(id);
    var userOptions = box.getElementsByClassName("ib-options")[0];
    var el = userOptions.children[i];
    var dim = el.getBoundingClientRect();

    var popup = document.createElement('div');
    var input = document.createElement('input');
    var button = document.createElement('button');

    button.className = "ib-pop-up-button"
    button.setAttribute("onclick", "updateLink(" + id + ", " + i + ")");
    input.type = "text";
    var link = (text) ? text : el.href;
    input.value = (link == document.URL.replace('#', '') + '#') ? '' : link;
    popup.className = "ib-pop-up";
    popup.id = "popup_" + id + "_" + i;

    popup.appendChild(input);
    button.appendChild(document.createElement('i'));
    popup.appendChild(button);
    body.appendChild(popup);
    popup.style.top = (dim.top - popup.clientHeight - 5) + "px";
    popup.style.left = dim.left - 0.5 * (popup.clientWidth + dim.left - dim.right) + "px";
    currentPopup = popup;
    return false;
}

function updateLink(id, i) {
    var newLink = currentPopup.getElementsByTagName("input")[0].value;

    var box = document.getElementById(id);
    var userOptions = box.getElementsByClassName("ib-options")[0];
    var el = userOptions.children[i]
    el.setAttribute("href", (newLink == '') ? '#' : newLink);

    if (newLink == '')
        el.firstChild.className = el.firstChild.className.replace('green', 'red');
    else
        el.firstChild.className = el.firstChild.className.replace('red', 'green');

    var body = document.getElementsByTagName("body")[0];
    body.removeChild(currentPopup);
}

function relocatePopup() {
    var body = document.getElementsByTagName("body")[0];
    try {
        var tmp = currentPopup.id.split('_');
        var id = tmp[1];
        var i = tmp[2];
        body.removeChild(currentPopup);
        showPopUp(id, i, currentPopup.getElementsByTagName("input")[0].value);
    }
    catch (e) {}
}

function saveInPlace(id) {
    var box = document.getElementById(id);
    var inputTitle = box.getElementsByClassName("ib-edit-title")[0];
    var inputSubtitle = box.getElementsByClassName("ib-edit-subtitle")[0];

    var data = new FormData();

	data.append('id', id);
	data.append('title', inputTitle.value);
	data.append('subtitle', inputSubtitle.value);

    var fields = ['eno', 'res', 'cor'] ;

    var userOptions = box.getElementsByClassName("ib-options")[0];
    for (var i = 0 ; i < userOptions.children.length ; i++) {
        var el = userOptions.children[i];
        data.append(fields[i], (el.href == document.URL.replace('#', '') + '#') ? '' : el.href);
        el.removeAttribute("onclick");
    }

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'db/proceed.php?td=modify', true);
	xhr.onload = function () {
        if (this.responseText == "ERROR") {
            insertBox("Impossible de mettre le TD à jour", "error");
        }
        else {return 0;}
	};
    xhr.send(data);

    var title = document.createElement('font');
    title.innerHTML = inputTitle.value;
    title.className = (inputTitle.value.length < 10) ? "ib-title-short" : "ib-title-long";
    box.insertBefore(title, box.children[1]);
    box.removeChild(inputTitle);

    var subtitle = document.createElement('font');
    subtitle.innerHTML = inputSubtitle.value;
    subtitle.className = "ib-subtitle";
    box.insertBefore(subtitle, box.children[3]);
    box.removeChild(inputSubtitle);

    var editOptions = box.getElementsByClassName("ib-edit")[0];
    var aDel = document.createElement('a');
    var iDel = document.createElement('i');
    aDel.setAttribute('onclick', 'deleteInPlace(' + id + ')');
    aDel.setAttribute('href', '#');
    iDel.className = "icon-delete";
    aDel.appendChild(iDel);
    editOptions.innerHTML = editOptions.innerHTML.replace('<br></br>', '');
    editOptions.appendChild(aDel);
    editOptions.firstChild.firstChild.className = "icon-modify";
    editOptions.firstChild.setAttribute("onclick", "editInPlace(" + id + ")");
    editOptions.firstChild.setAttribute('href', '#');


    var body = document.getElementsByTagName("body")[0];
    try { body.removeChild(currentPopup); } catch (e) {}
}

function deleteInPlace(id) {
    var data = new FormData();
    data.append('id', id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'db/proceed.php?td=delete', true);
    xhr.onload = function () {
        if (this.responseText == "ERROR") {
            insertBox(++maxInfoBoxID, "Impossible de supprimer le TD", "error");
        }
        else {return 0;}
    };

    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
    var box = document.getElementById(id);

    if (confirm("Êtes vous sur de vouloir supprimer \"" +
    box.children[1].innerHTML + "\" ?")) {
        xhr.send(data);
        wrap.removeChild(box);
    }
}

/*
 * RECHERCHE
 */

function insertSearchResult(result) {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    var box = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    var options = document.createElement('div');

    box.id = result.id;
    box.className = "ib";
    options.className = "ib-options";
    title.className = (result.title.length < 10) ? "ib-title-short" : "ib-title-long";
    subtitle.className = "ib-subtitle";

    title.innerHTML += result.title;
    subtitle.innerHTML += result.subtitle;

    // OPTIONS UTILISATEUR
    var iTitle = document.createElement('i');
    var iView = document.createElement('i');
    var iDetail = document.createElement('i');

    iTitle.className = "ib-title-icon ";
    iView.className = "search-result-icon-view";
    iDetail.className = "search-result-icon-detail";

    var aView = document.createElement('a');
    var aDetail = document.createElement('a');

    aView.setAttribute("href", result.path);
    aView.setAttribute("target", "_blank");
    aDetail.setAttribute("href", "#");
    aDetail.setAttribute("onclick", "toggleDocDetails(" + result.id + ")");

    switch (result.type) {
        case "tuto":
            iTitle.className += "search-result-tuto-icon";
            iTitle.title = "Tutoriel";
            break;
        case "datasheet":
            iTitle.className += "search-result-datasheet-icon";
            iTitle.title = "Datasheet";
            break;
        case "wiki":
            iTitle.className += "search-result-wiki-icon";
            iTitle.title = "Wiki";
            break;
    }

    aView.appendChild(iView);
    aView.innerHTML += " Consulter";
    aDetail.appendChild(iDetail);
    aDetail.innerHTML += " Détails";

    options.appendChild(aView);
    options.innerHTML += " | ";
    options.appendChild(aDetail);

    // Details (hidden part)
    var d = document.createElement('div');
    d.className = "search-result-detail";

    // TODO : a améliorer
    var pathSplit = result.path.split('.')
    d.innerHTML = "<b>Tags : </b>" + result.tags;
    d.appendChild(document.createElement('br'));
    d.appendChild(document.createElement('br'));
    d.innerHTML += "<b>Format : </b>" + pathSplit[pathSplit.length-1].toUpperCase();


    box.appendChild(iTitle);
    box.appendChild(title);
    box.insertBefore(document.createElement('br'), box.children[2]);
    box.appendChild(subtitle);

    box.appendChild(options);
    box.appendChild(d);

    wrapper.appendChild(box);
    fireResize();
}

function toggleDocDetails(id) {
    var b = document.getElementById(id);
    b.style.height = (b.style.height == "280px") ? "130px" : "280px";
}


/*
* Spécifique groupes élèves
*/
function insertGroup(json) {
    var group = JSON.parse(json);

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    var groupBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    groupBox.className = "ib";
    groupBox.id = "group-" + group.id_ori;
    options.className = "ib-options";
    title.className = (group.name.length < 10) ? "ib-title-short" : "ib-title-long";
    subtitle.className = "ib-subtitle";

    subtitle.innerHTML += group.members;
    title.innerHTML += group.name + "<br>";

    // OPTIONS DU DAARRT (console, webcam, ...)

    var iTitle = document.createElement('i');
    var iChoose = document.createElement('i');
    var iDelete = document.createElement('i');

    iTitle.className = "ib-title-icon group-box-title-icon";
    iChoose.className = "group-box-icon-select";
    iDelete.className = "group-box-icon-del";

    var aView = document.createElement('a');
    var aChoose = document.createElement('a');
    var aDelete = document.createElement('a');

    aChoose.setAttribute('href', 'groups/details.php?id=' + group.id_ori);
    aDelete.setAttribute('href', 'javascript:deleteGroup(' + group.id_ori + ')');

    // Assemblage des éléments de la box
    aChoose.appendChild(iChoose);
    aChoose.innerHTML += " Détails";
    aDelete.appendChild(iDelete);
    aDelete.innerHTML += " Supprimer";

    options.appendChild(aChoose);
    options.innerHTML += " | ";
    options.appendChild(aDelete);

    groupBox.appendChild(iTitle);
    groupBox.appendChild(title);
    groupBox.appendChild(subtitle);
    groupBox.appendChild(options);

    wrapper.appendChild(groupBox);
    fireResize();
}
