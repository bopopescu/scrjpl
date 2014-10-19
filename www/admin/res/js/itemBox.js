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

    subtitle.innerHTML += grp + ((grp == 1) ? " groupe" : " groupes");
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
}

function insertNewDaarrt(id, grp) {
    insertDaarrt(id, grp);
    insertBox(id, "Le DAARRT " + id + " vient de se connecter", "info");
}

function insertTd(id, sujet, eno, res, cor) {
    var wrapper = document.getElementsByClassName("item-zone-wrapper")[0];;
    var tdBox = document.createElement('div');
    var options = document.createElement('div');
    var title = document.createElement('font');
    var subtitle = document.createElement('font');
    tdBox.className = "item-box";
    options.className = "item-box-options td-box-options";
    title.className = "item-box-title";
    subtitle.className = "item-box-subtitle";

    title.innerHTML += "TD " + id + "<br/>";
    subtitle.innerHTML += sujet;

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
    tdBox.appendChild(subtitle);
    tdBox.appendChild(options);

    wrapper.appendChild(tdBox);
}
