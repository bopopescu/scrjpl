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
    var icon = document.getElementsByClassName("search-icon")[0];
    icon.className = "search-icon-spinner";

    setTimeout(function() {icon.className = "search-icon";}, 2000);


}