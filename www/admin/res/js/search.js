var lockSearch = false;

function showSearchOptions() {
    var wrapper = document.getElementById("search-form");
    var p = document.getElementById("search-options-title");
    var table = document.getElementById("advanced-search-options");



    if (wrapper.style.height == "45px" || wrapper.style.height == "") {
        wrapper.style.height = 85 + p.offsetHeight + table.clientHeight + "px";}
    else
        wrapper.style.height = "45px";
}

function search() {
    var query = document.getElementById("search-input").value;

    if (query != "") {
        // On implémente un verrou pour éviter une double requête
        if (lockSearch) return 1;
        else toggleLock();

        var icon = document.getElementsByClassName("search-icon")[0];
        icon.className = "search-icon-spinner";

        var wrap = document.getElementsByClassName("item-zone-wrapper")[0];
        // Nettoyage de la recherche précédente
        while (wrap.firstChild) { wrap.removeChild(wrap.firstChild) };

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'db/proceed.php?search=' + query, true);
        xhr.onload = function () {
            var result = JSON.parse(this.responseText);
            for (var i = 0 ; i < result.length ; i++) {
                fireTimeout(result[i], i);
            }
            if (result.length == 0) {
                var p = document.createElement('p');
                p.innerText = "Aucun résultat !";
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
