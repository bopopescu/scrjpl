var keys = [];
var code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
window.onkeydown = function(e){
    keycode = e.keyCode;

    if (keycode == code[keys.length]) {
        keys.push(keycode);
        if(JSON.stringify(keys) == JSON.stringify(code)){
            var body = document.getElementsByTagName('body')[0];
            var img = document.createElement('img');
            img.id = 'konami';
            img.src = 'res/konami/easter.jpg';
            body.appendChild(img);
            // alert('work');
        }
    }
    else {
        keys = [];
    }
}
