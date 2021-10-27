window.jQuery = window.$ = jQuery;
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'partner_player_only/css/player_only.css'
});
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'partner_player_only/css/player_resp.css'
});
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'varia/core_webrtc_beta.css'
});
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'partner_player_only/css/player_webrtc_only.css'
});
$('<link>').appendTo('head').attr({
    type: 'text/css',
    rel: 'stylesheet',
    href: 'partner_player_only/css/lounge.css'
});
if (!$("script[src='common_partner_plugins.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "partner_player_only/js/common_partner_plugins.js"
    });
}
if (!$("script[src='common_partner_functions.js']").length) {
    $('<script>').appendTo('head').attr({
        type: 'text/javascript',
        src: "partner_player_only/js/common_partner_functions.js"
    });
}
var player_partner_name = 'Convergent Trading';
var channel_type = 'Trade';
$(window).on('load', function() {
    $.ajax({
        url: "https://www.livesquawk.com/partner_player_only/embedded_content_webrtc_only.php",
        cache: true,
        data: {
            partner_name: player_partner_name
        }
    }).done(function(data) {
        $('#livesquawk_player_outer').append(data);
        start_button_click();
    });
});

function start_button_click() {
    $(document).on("click", ".webrtc_start_button", function(event) {
        event.preventDefault();
        load_script_with_callback('partner_player_only/js/player_webrtc_lounge.js', comfun_webrtc_js_loaded);
    });
}