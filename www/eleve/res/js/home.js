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
        else {return 0;}
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

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'db/proceed.php?group=' + id + '&action=select', true);
        xhr.onload = function () {
            icon = document.getElementById('group-' + id).getElementsByClassName('group-box-icon-select')[0];
            icon.className = 'group-box-icon-selected';
            icon.parentNode.innerHTML = icon.parentNode.innerHTML.replace('Choisir', 'Choisit');
        }
        xhr.send();

        selected_group = id;
    }
    else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'db/proceed.php?group=' + id + '&action=unselect', true);
        xhr.onload = function () {
            icon = document.getElementById('group-' + id).getElementsByClassName('group-box-icon-selected')[0];
            icon.className = 'group-box-icon-select';
            icon.parentNode.innerHTML = icon.parentNode.innerHTML.replace('Choisit', 'Choisir');
        }
        xhr.send();
        selected_group = null;
    }
}
