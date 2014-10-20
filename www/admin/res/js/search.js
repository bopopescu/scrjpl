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
    try {
        var icon = document.getElementsByClassName("search-icon")[0];
        icon.className = "search-icon-spinner";
    } catch(e) { return 0; }

    var wrap = document.getElementById("search_results");
    while (wrap.firstChild) { wrap.removeChild(wrap.firstChild)};

    setTimeout(function() {
            var p = document.createElement('p');
            p.innerText = "Aucun résultat !";
            p.style.fontSize = "30px";
            p.style.color = "#c34747";
            p.style.textAlign = "center";
            wrap.appendChild(p);
            icon.className = "search-icon";
        }, 2000);


}
