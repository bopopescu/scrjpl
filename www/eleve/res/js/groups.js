var user_count = 2;

function addMemberInput(cnt) {
    if (cnt) {
        user_count = cnt;
        document.getElementsByClassName('add-icon')[0].setAttribute('onclick', 'javascript:addMemberInput()');
    }
    var last_user = document.getElementById('user_' + user_count);
    var next_user = last_user.cloneNode();

    user_count++;
    next_user.id = "user_" + user_count;
    next_user.name = "user_" + user_count;
    next_user.value = "";
    next_user.placeholder = "Nom du " + user_count + "eme membre";

    last_user.parentNode.insertBefore(next_user, last_user.nextSibling);
    next_user.parentNode.insertBefore(document.createElement('br'), next_user);
}

function insertSelectableDaarrt(json) {
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
    title.innerHTML += daarrt.name;

    daarrtBox.setAttribute('onclick', 'toggleDaarrt(this)');

    var iTitle = document.createElement('i');
    iTitle.className = "ib-title-icon daarrt-box-title-icon";

    daarrtBox.appendChild(iTitle);
    daarrtBox.appendChild(title);
    daarrtBox.appendChild(document.createElement('br'));
    daarrtBox.appendChild(subtitle);
    daarrtBox.appendChild(options);

    wrapper.appendChild(daarrtBox);
    daarrtList.push(daarrt.id);
    fireResize();
}

function toggleDaarrt(e) {
    var nameInput = document.getElementById('daarrt_names');
    var idInput = document.getElementById('daarrt_list');

    var daarrtName = e.children[1].innerHTML + " (" + e.id.split('-')[1] + ")";

    if (e.style.backgroundColor == "rgb(212, 230, 189)") {
        e.style.backgroundColor = "#f0f0f0";

        idInput.value = idInput.value.replace(',' + e.id.split('-')[1], '');
        idInput.value = idInput.value.replace(e.id.split('-')[1], '');

        if (idInput.value.substring(0, 1) == ',') {
            idInput.value = idInput.value.substring(1);
        }

        nameInput.value = nameInput.value.replace(', ' + daarrtName, '');
        nameInput.value = nameInput.value.replace(daarrtName, '');

        if (nameInput.value.substring(0, 2) == ', ') {
            nameInput.value = nameInput.value.substring(2);
        }
    }
    else {
        e.style.backgroundColor = "rgb(212, 230, 189)";
        nameInput.value += (nameInput.value == "") ? daarrtName : ", " + daarrtName;
        idInput.value += (idInput.value == "") ? e.id.split('-')[1] : "," + e.id.split('-')[1];
    }
}


var selected_group = null;

function searchGroup(group_name) {
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'db/proceed.php?group=' + group_name + '&action=search', true);
    xhr.onload = function () {
        var result = JSON.parse(this.responseText);

        // On supprime les anciens résultats.
        while (wrap.firstChild) {
            wrap.removeChild(wrap.firstChild);
        }

        for (var i = 0 ; i < result.length ; i++) {
            fireTimeout(result[i], i);
        }
        if (result.length == 0) {
            // body.removeAttribute("onresize");
            var p = document.createElement('p');
            p.innerHTML = "Aucun résultat !";
            p.style.fontSize = "30px";
            p.style.color = "#c34747";
            p.style.textAlign = "center";
            wrap.appendChild(p);
        }

        // On enlève le verrou
        //setTimeout(toggleLock, result.length * 100);
    };
    xhr.send();
}

function fireTimeout(r, i) {
    setTimeout(function () {insertGroup(JSON.stringify(r));}, (i*100));
};

function deleteGroup(id) {
    var data = new FormData();
    data.append('id', id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'db/proceed.php?group=' + id + '&action=delete', true);
    xhr.onload = function () {
        if (this.responseText == "ERROR") {
            insertBox(++maxInfoBoxID, "Impossible de supprimer le TD", "error");
        }
        else {
            var cookie = docCookies.getItem('group');
            if (cookie == id) docCookies.removeItem('group');
        }
    };

    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
    var box = document.getElementById("group-" + id);

    if (confirm("Êtes vous sur de vouloir supprimer \"" + box.children[1].innerHTML.replace("<br>", "") + "\" ?")) {
        xhr.send(data);
        wrap.removeChild(box);
    }
}

function toggleGroup(id) {
    var icon;

    if (selected_group != id) {
        if (selected_group != null) toggleGroup(selected_group);


        icon = document.getElementById('group-' + id).getElementsByClassName('group-box-icon-select')[0];
        icon.className = 'group-box-icon-selected';
        icon.parentNode.innerHTML = icon.parentNode.innerHTML.replace('Choisir', 'Choisit');
        selected_group = id;
        docCookies.setItem('group', id, 5 * 3600);
    }
    else {
        icon = document.getElementById('group-' + id).getElementsByClassName('group-box-icon-selected')[0];
        icon.className = 'group-box-icon-select';
        icon.parentNode.innerHTML = icon.parentNode.innerHTML.replace('Choisit', 'Choisir');
        selected_group = null;
        docCookies.removeItem('group');
    }
}
