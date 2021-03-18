var ls_site_url = 'https://www.livesquawk.com/';
var socket;
var remote_ip = '';
var php_session_id = '';
var publisher_channel = '';
var ls_http_referrer = '';
var ls_user_email = '';
if (typeof socket === 'undefined') {
    var distributor_server = 3010;
    var assigned_server = 0;
    var socket;
    var current_port = 0;
}

function messenger_start_init() {
    if (typeof socket === 'undefined') {
        messenger_socket_connection_start(distributor_server);
    }
    $('#newsfeed__outer').css({
        overflow: ''
    });
    new SimpleBar($('#newsfeed__outer')[0]);
    newfeed_reveal();
    recalc_news_item_times();
}

function add_messenger_specific_socket_ons() {
    console.log('messenger_addons');
    socket.on('new note', function(data) {
        write_new_note(data);
    });
}

function messenger_socket_connection_start(server) {
    console.log('messenger_connecting_sockets');
    socket = io.connect('https://ws.livesquawk.com', {
        path: '/ws' + server + '/socket.io',
        transports: ['websocket'],
        upgrade: false,
        timeout: 10000,
        reconnectionAttempts: '3',
        forceNew: true
    });
    current_server = server;
    socket.on('connect', function() {
        $('.output').append('Connected to server ' + current_server + '<br>');
        if (current_server == distributor_server) {
            socket.emit('request_server_assignment');
        } else {
            socket.emit('join_channel', {
                publisher_channel: publisher_channel,
                username: ls_messenger_partner_name,
                subscriber_group: '',
                display_name: ls_messenger_partner_name,
                single_sign_on: ''
            });
        }
    });
    socket.on('connection_response', function(data) {
        $('.output').append(data + "<br>");
    });
    socket.on('output', function(data) {
        $('.output').append(data + "<br>");
    });
    socket.on('server_assignment_response', function(data) {
        assigned_server = data;
        socket.disconnect();
        $('.output').append('Disconnected from distributor<br>');
        $('.output').append('Client sent to server ' + data + '<br>');
        messenger_socket_connection_start(assigned_server);
    });
    socket.on('server_ping', function(data) {});
    socket.on('reconnect', function() {
        $('.output').append('Reconnected<br>');
    });
    socket.on('disconnect', function() {
        $('.output').append('Disconnected<br>');
    });
    socket.on('client_tweet_in', function(data) {});
    socket.on('new_latest_news', function(data) {});
    socket.on('reload', function(data) {
        document.cookie = "reload_restart=true";
        try {} catch (err) {
            console.log(err);
        }
    });
    add_messenger_specific_socket_ons();
    if (typeof add_calendar_specific_socket_ons !== 'undefined') {
        add_calendar_specific_socket_ons();
    }
    if (typeof add_player_specific_socket_ons !== 'undefined') {
        add_player_specific_socket_ons();
    }
}

function write_new_note(data) {
    if (data.type_alert == 1 || data.alert == 1) {
        var alertreport_modifier = 'news__item__outer--alert';
    } else if (data.report == 1) {
        var alertreport_modifier = 'news__item__outer--report';
    } else {
        var alertreport_modifier = '';
    }
    var display_date = new Date(data.unix_date * 1000);
    var hours = display_date.getHours();
    var minutes = display_date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    var hours = hours % 12;
    hours = hours ? hours : 12;
    var minutes = minutes < 10 ? '0' + minutes : minutes;
    var seconds = display_date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (data.show_seconds.indexOf('Show') !== false) {
        var display_time = hours + ':' + minutes;
    } else {
        var display_time = hours + ':' + minutes + ':' + seconds;
    }
    if ((data.subtitle.length > 0 || data.body.length > 0)) {
        var content_modifier = 'news__item__content--reveal';
    } else {
        var content_modifier = '';
    }
    var current_date = $('.news__item__outer--date_change:first').children('.news__item__time').clone();
    $(current_date).children('.newsfeed__title__timezone').remove();
    current_date = $(current_date).html();
    var date_year = display_date.getFullYear();
    var date_day = display_date.getDate();
    date_day = date_day < 10 ? '0' + date_day : date_day;
    var date_month = display_date.getMonth() + 1;
    date_month = date_month < 10 ? '0' + date_month : date_month;
    var day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var this_date = day_names[display_date.getDay()] + " " + date_day + "." + date_month + "." + date_year;
    var note_html = "<div class='news__item__outer news__item__outer--first " + alertreport_modifier + "'>";
    note_html += "<div class='news__item__time' data-itemtime='" + data.unix_date + "'>" + display_time + "</div>";
    note_html += "<div class='news__item__line__outer'>";
    note_html += "<div class='news__item__line'></div>";
    note_html += "<div class='news__item__circle'><svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50'></circle></svg></div>";
    note_html += "</div>";
    note_html += "<div class='news__item__content " + content_modifier + "'>";
    note_html += "<div class='news__item__title'>" + data.title + "</div>";
    if (data.subtitle.length > 0) {
        note_html += "<div class='news__item__subtitle'>" + data.subtitle + "</div>";
    }
    if (data.body.length > 0) {
        note_html += "<div class='news__item__body'>" + data.body + "</div>";
    }
    note_html += "</div>";
    note_html += "</div>";
    var current_first = $('.news__item__outer--first');
    if (current_date != this_date) {
        $(current_first).removeClass('news__item__outer--first');
        $('#newsfeed__outer .simplebar-content').prepend(note_html);
        $('#newsfeed__outer .simplebar-content').prepend("<div class='news__item__outer news__item__outer--date_change'><div class='news__item__time'>" + this_date + "</div></div>");
    } else {
        $(current_first).before(note_html);
        $(current_first).removeClass('news__item__outer--first');
    }
    newsfeed_a_target_blank();
    recalc_news_item_times();
}

function newsfeed_a_target_blank() {
    $('#newsfeed__outer a:not([target]), #newsfeed__outer a[target="_self"]').each(function() {
        $(this).attr('target', '_blank');
    });
}

function recalc_news_item_times() {
    if (typeof Cookies.get('timezone_code') === 'undefined') {
        var DateTime = luxon.DateTime;
        var now = DateTime.local();
        this_tz_name = now.zoneName;
    } else {
        var this_tz_name = jQuery.parseJSON(Cookies.get('timezone_code'))[1];
        if (jQuery.parseJSON(Cookies.get('timezone_code'))[0] == 'Local') {
            var DateTime = luxon.DateTime;
            var now = DateTime.local();
            this_tz_name = now.zoneName;
        }
    }
    $('.news__item__time').each(function() {
        if (typeof $(this).attr('data-itemtime') != 'undefined') {
            var this_time = $(this).attr('data-itemtime');
            var this_date = luxon.DateTime.fromMillis(parseInt(this_time) * 1000);
            var rezoned = this_date.setZone(this_tz_name);
            $(this).html(rezoned.toFormat('H:mm').toLowerCase());
        }
    });
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

function newfeed_reveal() {
    $(document).on('click', '.news__item__content--reveal .news__item__title', function() {
        $(this).siblings().slideToggle();
    });
}