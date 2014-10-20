var resizeTimer = 0;

function setBoxWrapperSize(nMax, pMin) {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fireResize, 200);
}

function fireResize() {
    var container = document.getElementsByClassName("item-zone")[0];
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];;
    var boxes = document.getElementsByClassName("item-box");
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
    e.getElementsByClassName("item-box-edit")[0].style.opacity = "1";
}

function hideEditOptions(e) {
    e.getElementsByClassName("item-box-edit")[0].style.opacity = "0";
}

function insertDaarrt(id, grp) {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];;
    var daarrtBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    daarrtBox.className = "item-box";
    options.className = "item-box-options";
    title.className = "item-box-title";
    subtitle.className = "item-box-subtitle";

    subtitle.innerHTML += grp + ((grp <= 1) ? " groupe" : " groupes");
    title.innerHTML += "DAARRT " + id + "<br/>";

    var iTitle = document.createElement('i');
    var iView = document.createElement('i');
    var iConsole = document.createElement('i');
    var iDetail = document.createElement('i');

    iTitle.className = "item-box-title-icon daarrt-box-title-icon";
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

var maxTdId = 0;

function insertTd(id, sujet, eno, res, cor) {
    maxTdId = Math.max(id, maxTdId);

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];;
    var tdBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');

    tdBox.setAttribute("onmouseover", "showEditOptions(this)");
    tdBox.setAttribute("onmouseout", "hideEditOptions(this)");

    tdBox.id = id;
    tdBox.className = "item-box";
    options.className = "item-box-options td-box-options";
    title.className = "item-box-title";
    subtitle.className = "item-box-subtitle";

    title.innerHTML += "TD " + id + "<br/>";
    subtitle.innerHTML += sujet;

    // OPTIONS D'EDITION
    var edit = document.createElement('div');
    var aEdit = document.createElement('a');
    var aDel = document.createElement('a');
    var iEdit = document.createElement('i');
    var iDel = document.createElement('i');

    aEdit.setAttribute('onclick', 'editInPlace(' + id + ')');
    aEdit.setAttribute("href", "#");
    aDel.setAttribute("href", "#");

    edit.className = "item-box-edit";
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

    iTitle.className = "item-box-title-icon td-box-title-icon";
    iEno.className = "td-box-icon-eno";
    iRes.className = "td-box-icon-res";
    iCor.className = "td-box-icon-cor";

    var aEno = document.createElement('a');
    var aRes = document.createElement('a');
    var aCor = document.createElement('a');

    aEno.setAttribute('href', '#');
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
    tdBox.appendChild(subtitle);

    tdBox.appendChild(edit);

    tdBox.appendChild(options);

    wrapper.appendChild(tdBox);
    fireResize();
}

function insertNewTd() {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    wrapper.removeChild(wrapper.lastChild);
    insertTd(++maxTdId, "Sujet du TD " + maxTdId, 0, 0, 0);
    setTimeout(insertAddTdItem, 100);
}

function insertAddTdItem() {

    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];
    var addTdBox = document.createElement('div');
    var a = document.createElement('a');
    var i = document.createElement('i');

    a.setAttribute("href", "javascript:insertNewTd()");

    addTdBox.id = "add-td-box";
    addTdBox.className = "item-box";

    a.appendChild(i);
    addTdBox.appendChild(a);
    wrapper.appendChild(addTdBox);
    fireResize();
}

function editInPlace(id) {
    var box = document.getElementById(id);
    var title = box.getElementsByClassName("item-box-title")[0];
    var subtitle = box.getElementsByClassName("item-box-subtitle")[0];
    box.removeChild(title);

    var inputTitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.style.fontSize = "35px";
    inputTitle.style.width = "100px";
    inputTitle.value = title.innerText;
    box.insertBefore(inputTitle, box.children[1]);
    box.insertBefore(document.createElement('br'), box.children[2]);
    box.removeChild(title);

    var inputSubtitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.style.fontSize = "35px";
    inputTitle.style.width = "100px";
    inputTitle.value = title.innerText;
    box.insertBefore(inputTitle, box.children[1]);
    box.insertBefore(document.createElement('br'), box.children[2]);
    box.removeChild(title);

    // box.appendChild(inputTitle);

    // alert(title);
}
