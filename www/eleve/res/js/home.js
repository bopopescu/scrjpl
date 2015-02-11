function searchGroup(group_name) {
    var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'db/proceed.php?groupSearch=' + group_name, true);
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
        setTimeout(toggleLock, result.length * 100);
    };
    xhr.send();
}

function fireTimeout(r, i) {
    setTimeout(function () {insertTd(r.id, r.name,  r.members, "", "", "");}, (i*100));
};

function deleteGroup(id_ori) {
    alert(id_ori);
}
