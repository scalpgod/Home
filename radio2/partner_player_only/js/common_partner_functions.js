var site_url = 'https://livesquawk.com';
var remote_ip = '';
var php_session_id = '';
var publisher_channel = '';
var boot_cycle_time = 120000;
var distributor_server = 3010;
var assigned_server = 0;
var socket;
var current_port = 0;
var s_name = '';

function set_static_session_info() {
    session_info['browser_codename'] = navigator.appCodeName;
    session_info['browser_name'] = navigator.appName;
    session_info['user_agent'] = navigator.userAgent;
    session_info['browser_version'] = navigator.appVersion;
    session_info['cookies_enabled'] = navigator.cookieEnabled;
    session_info['platform'] = navigator.platform;
    session_info['player_version'] = player_version_no;
    session_info['stream'] = s_name;
    session_info['connection_protocol'] = protocol;
    session_info['delay_target'] = 0;
    session_info['session_email'] = $('#username_value').html();
}

function comfun_play_popup_flash() {
    $(document).on('click', '.header__player__strip__button--flash', function(event) {
        event.preventDefault();
        Cookies.set('popup_type', 'flash', {
            path: '/',
            sameSite: 'strict',
            secure: true
        });
        check_boot();
        load_script_with_callback(site_url + 'player_flash_tradingfloor.js', comfun_flash_js_loaded);
    });
}

function comfun_play_pop_webrtc() {
    $(document).on('click', '.header__player__strip__button--webrtc', function(event) {
        event.preventDefault();
        Cookies.set('popup_type', 'webrtc', {
            path: '/',
            sameSite: 'strict',
            secure: true
        });
        check_boot();
        load_script_with_callback(site_url + 'player_webrtc_tradingfloor.js', comfun_webrtc_js_loaded);
    });
}

function check_boot() {
    console.log('checked_boot');
    var sess = new Date();
    var nocache = sess.getTime();
    if (typeof sess_id !== 'undefined') {
        boot_url = "https://www.livesquawk.com/player/ajax/new_partner_boot.php?time=" + nocache + "&product=" + product + '&sess_id=' + sess_id
    } else {
        var boot_url = "https//www.livesquawk.com/player/ajax/boot.php?time=" + nocache + "&product=" + product;
    }
    $.ajax({
        url: boot_url,
        cache: false,
        async: true,
        timeout: 3000,
        dataType: 'text',
        success: function(data) {
            if (data == 'boot') {
                if (window.opener != null) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    location.reload(true);
                }
            } else if (data == 'boot_and_die') {
                window.close();
            } else {
                setTimeout("check_boot()", boot_cycle_time);
            }
        }
    });
}

function comfun_webrtc_js_loaded() {
    socket_connection_start(distributor_server);
    $('.webrtc__player__outer').show();
    $('.header__player__strip--choice').hide();
    $("#user_agent").html(capitalize(adapter.browserDetails.browser));
}

function comfun_flash_js_loaded() {
    socket_connection_start(distributor_server);
    $('.header__player__strip--choice').hide();
    $('.player__outer').show();
    socket_io_loaded();
    load_player();
    set_static_session_info();
    $('#player_version').html(player_version_no);
}

function setCookie(value) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 21);
    var c_value = escape(value) + "; expires=" + exdate.toUTCString();
    document.cookie = "player_volume=" + c_value + "; path=/; secure; samesite=none";
}

function getCookie() {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + "player_volume" + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf("player_volume=");
    }
    if (c_start == -1) {
        c_value = 999;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
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