window.jQuery = window.$ = jQuery;
if (!$("link[href='varia/simplebar.css']").length) {
    $('<link>').appendTo('head').attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: 'varia/simplebar.css'
    });
}
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'partner_messenger/css/partner_messenger_dark.css'
});
if (!$("script[src='https://cdn.polyfill.io/v2/polyfill.js?features=default,String.prototype.repeat,Array.prototype.find,Array.prototype.findIndex,Math.trunc,Math.sign,Object.assign']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "https://cdn.polyfill.io/v2/polyfill.js?features=default,String.prototype.repeat,Array.prototype.find,Array.prototype.findIndex,Math.trunc,Math.sign,Object.assign"
    });
}
if (!$("script[src='varia/luxon.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "varia/luxon.js"
    });
}
if (!$("script[src='https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"
    });
}
if (!$("script[src='varia/jquery-ui_ct.min.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "varia/jquery-ui_ct.min.js"
    });
}
if (!$("script[src='https://cdn.jsdelivr.net/npm/simplebar@4.2.3/dist/simplebar.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "https://cdn.jsdelivr.net/npm/simplebar@4.2.3/dist/simplebar.js"
    });
}
if (!$("script[src='varia/socket.io.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "varia/socket.io.js"
    });
}
if (!$("script[src='partner_messenger/js/partner_messenger.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "partner_messenger/js/partner_messenger.js"
    });
}
var ls_messenger_partner_name = 'Convergent Trading';
$(window).on('load', function() {
    messenger_start_loaded();
});

function messenger_start_loaded() {
    $.ajax({
        url: "https://www.livesquawk.com/partner_messenger/embedded_content.php",
        cache: false,
        data: {
            partner_name: ls_messenger_partner_name
        }
    }).done(function(data) {
        $('#livesquawk_messenger_outer').append(data);
        messenger_start_init();
    });
}

function load_script_with_callback(url, function_name) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                eval(function_name)();
            }
        };
    } else {
        script.onload = function() {
            eval(function_name)();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}