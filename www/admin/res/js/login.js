var resizeTimer = 0;

// Bloque la fonction fireResize jusqu'a la fin du redimensionnement
function resize() {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fireResize, 200);
}

// Adapte la boite de login en fonction de la taille de la fenêtre
function fireResize() {
    var wrap = document.getElementById('login_wrapper');
    var wrapHeight = wrap.clientHeight;
    var newHeight = Math.max(20, 0.5 * (wrapHeight - wrap.children[0].clientHeight));
    wrap.children[0].style.top = newHeight + "px";
}
