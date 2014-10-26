var maxInfoBoxID = 0;
var resizeTimer = 0;
var maxTdId = 0;

function setBoxWrapperSize() {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fireResize, 200);
}

function fireResize() {
    var container = document.getElementsByClassName("item-zone")[0];
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];;
    var boxes = document.getElementsByClassName("ib");
    var box = window.getComputedStyle(boxes[0]);

    var n; var p;

    if (container.clientWidth < 480) { n = 1;p = 0.91; }
    else if (container.clientWidth < 605) { n = 1; p = 0.93; }
    else if (container.clientWidth < 780) { n = 2; p = 0.46; }
    else if (container.clientWidth < 900) { n = 2; p = 0.47; }
    else { n = 3; p = 0.31; }

    wrap.style.width = n * (p * container.clientWidth
            + 2 * parseInt(box.getPropertyValue('margin-right')));

    for (var i = 0 ; i < boxes.length ; i++) {
        boxes[i].style.width = p * 100 + "%";
    }

    wrap.style.margin = "10px auto";
}

function showEditOptions(e) {
    e.getElementsByClassName("ib-edit")[0].style.opacity = "1";
}

function hideEditOptions(e) {
    e.getElementsByClassName("ib-edit")[0].style.opacity = "0";
}

function insertDaarrt(id, grp) {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];;
    var daarrtBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    daarrtBox.className = "ib";
    options.className = "ib-options";
    title.className = "ib-title";
    subtitle.className = "ib-subtitle";

    subtitle.innerHTML += grp + ((grp <= 1) ? " groupe" : " groupes");
    title.innerHTML += "DAARRT " + id + "<br/>";

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

    aView.setAttribute('href', 'daarrt/view.php?id=' + id);
    aConsole.setAttribute('href', 'daarrt/ssh.php?id=' + id);
    aDetail.setAttribute('href', 'daarrt/details.php?id=' + id);

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
    fireResize();
}

function insertNewDaarrt(id, grp) {
    insertDaarrt(id, grp);
    insertBox(id, "Le DAARRT " + id + " vient de se connecter", "info");
}

// TD

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
    title.className = "ib-title";
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

    // OPTIONS UTILISATEUR
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

    aEno.setAttribute('href', 'td/enonce.php?id=' + id);
    aRes.setAttribute('href', 'td/ressources.php?id=' + id);
    aCor.setAttribute('href', 'td/correction.php?id=' + id);

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
    var title = box.getElementsByClassName("ib-title")[0];
    var subtitle = box.getElementsByClassName("ib-subtitle")[0];

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
}

function saveInPlace(id) {
    var box = document.getElementById(id);
    var inputTitle = box.getElementsByClassName("ib-edit-title")[0];
    var inputSubtitle = box.getElementsByClassName("ib-edit-subtitle")[0];

    var data = new FormData();

	data.append('id', id);
	data.append('title', inputTitle.value);
	data.append('subtitle', inputSubtitle.value);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'db/proceed.php?td=modify', true);
	xhr.onload = function () {
        if (this.responseText == "ERROR") {
            insertBox(++maxInfoBoxID, "Impossible de mettre le TD à jour", "error");
        }
        else {return 0;}
	};
    xhr.send(data);

    var title = document.createElement('font');
    title.innerHTML = inputTitle.value;
    title.className = "ib-title";
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
    box.getElementsByClassName("ib-title")[0].innerHTML + "\" ?")) {
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
    title.className = "ib-title";
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

    aView.setAttribute("href", "#");
    aDetail.setAttribute("href", "#");

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

    box.appendChild(iTitle);
    box.appendChild(title);
    box.insertBefore(document.createElement('br'), box.children[2]);
    box.appendChild(subtitle);

    box.appendChild(options);

    wrapper.appendChild(box);
    fireResize();
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
