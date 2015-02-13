var user_count = 2;

function addMemberInput() {
    var last_user = document.getElementById('user_' + user_count);
    var next_user = last_user.cloneNode();

    user_count++;
    next_user.id = "user_" + user_count;
    next_user.name = "user_" + user_count;
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

    if (e.style.backgroundColor == "#ace265" || e.style.backgroundColor == "rgb(172, 226, 101)") {
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
        e.style.backgroundColor = "#ace265";
        nameInput.value += (nameInput.value == "") ? daarrtName : ", " + daarrtName;
        idInput.value += (idInput.value == "") ? e.id.split('-')[1] : "," + e.id.split('-')[1];
    }
}
