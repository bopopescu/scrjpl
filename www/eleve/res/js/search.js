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
