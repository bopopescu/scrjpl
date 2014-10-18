function closeBox(id) {
    document.getElementById(id).className += " infobox-closing";
    setTimeout(function() {
        var wrapper = document.getElementById("infobox-zone");
        var infobox = document.getElementById(id);
        infobox.style.height = infobox.offsetHeight;
        infobox.style.margin = "0px";
        infobox.style.padding = "0px";
        infobox.style.height = "0px";
        setTimeout(function() {wrapper.removeChild(infobox);}, 200);
    }, 300);
}

function insertBox(id, message, type) {
    var wrapper = document.getElementById("infobox-zone");
    var infobox = document.createElement("div");
    infobox.id = id;

    var i = document.createElement("i");
    i.className = "infobox-icon";

    var a = document.createElement("a");
    var i2 = document.createElement("i");
    a.setAttribute('href', 'javascript:closeBox(\"' + id + '\")');
    i2.className = "infobox-close-icon";

    infobox.className = "infobox ";
    switch (type) {
        case "error":
            message = "<b>Erreur : </b>" + message;
            infobox.className += "infobox-error";
            break;
        case "warning":
            message = "<b>Attention : </b>" + message;
            infobox.className += "infobox-warning";
            break;
        default:
            message = "<b>Information : </b>" + message;
            infobox.className += "infobox-info";
    }

    infobox.appendChild(i);
    a.appendChild(i2);
    infobox.appendChild(a);
    infobox.innerHTML += message;

    wrapper.appendChild(infobox);
}
