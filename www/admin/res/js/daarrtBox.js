function fireResize() {
    var wrap = document.getElementsByClassName("daart-zone-wrapper")[0];
    var boxes = document.getElementsByClassName("daart-box");
    var box = window.getComputedStyle(boxes[0]);

    var fact = Math.round(boxes[0].clientWidth/wrap.clientWidth *100) / 100;

    var size = 3 * (0.31 * document.getElementById("daarrt-zone").clientWidth
            + parseInt(box.getPropertyValue('margin')))
            + parseInt(box.getPropertyValue('margin')) ;

    if (document.getElementById("daarrt-zone").clientWidth < 830 ||
    size > document.getElementById("daarrt-zone").clientWidth) {
        wrap.style.width = 2 * (0.46 * document.getElementById("daarrt-zone").clientWidth
                + parseInt(box.getPropertyValue('margin')))
                + parseInt(box.getPropertyValue('margin')) + "px";

        for (var i = 0 ; i < boxes.length ; i++) {
            boxes[i].style.width = "46%";
        }
    }
    else {
        wrap.style.width = size + "px";
        for (var i = 0 ; i < boxes.length ; i++) {
            boxes[i].style.width = "31%";
        }
    }

    wrap.style.margin = "auto";

    //alert(box.clientWidth);
}

var resizeTimer = 0;
function setSizeBoxWrapper()
{
    if (resizeTimer)
        clearTimeout(resizeTimer);

    resizeTimer = setTimeout(fireResize, 300);
}
