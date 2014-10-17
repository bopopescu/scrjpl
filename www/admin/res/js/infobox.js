function closeBox(id) {
    document.getElementById(id).style.left = "100%";
    setTimeout(function() {
        var wrapper = document.getElementById("infobox-zone");
        wrapper.removeChild(document.getElementById(id));
    }, 300);
}

function insertBox(id, message, type) {
    var wrapper = document.getElementById("infobox-zone");
    var infobox = document.createElement("div");
    infobox.id = id;

    var i = document.createElement("i");
    i.className="infobox-icon";
    infobox.appendChild(i);

    var a = document.createElement("a");
    var i2 = document.createElement("i");
    a.setAttribute('href', 'javascript:closeBox(\"' + id + '\")');
    i2.className="infobox-close-icon";
    a.appendChild(i2);
    infobox.appendChild(a);

    infobox.className = "infobox ";
    switch (type) {
        case "error":
            infobox.className += "infobox-error";
            break;
        case "warning":
            infobox.className += "infobox-warning";
            break;
        default:
            infobox.className += "infobox-info";
    }

    infobox.innerHTML += message;
    wrapper.appendChild(infobox);
}
