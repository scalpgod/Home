var remoteVideo = null;
var peerConnection = null;
var peerConnectionConfig = {
    'iceServers': []
};
var localStream = null;
var wsURL = "wss://5ec3b203a6241.streamlock.net/webrtc-session.json";
var wsConnection = null;


//var streamInfo = { applicationName:"webrtc_tradingfloor", streamName:"tradingfloor_webrtc", sessionId:"[empty]" };
//var streamInfo = { applicationName:"webrtc_trade", streamName:"trade_webrtc", sessionId:"[empty]" };
var streamInfo = { applicationName:"webrtc", streamName:"macro_webrtc", sessionId:"[empty]" };

var userData = {
    param1: "value1"
};
var server_ip = "54.77.234.138";
var last_packet_timestamp = 0;
var last_packet_max_diff = 2000;
var off_air = true;
var start_off_air = true;
var currently_sound = false;
var silence_level = 20;
var silence_time = 500;
var silence_timeout = null;
var volume_width = 0;
var vol_level = 0.75;
var pre_muted_volume = 0.75;
var is_muted = true;
var average_packets_lost_last_10 = 0;
var ping_time = 0;
var average_jitter = 0;
var protocol = '';
var username = '';
var effective_latency = 0;
var mean_opinion_score = 0;
var player_version_no = "WebRTC2.0";
var publisher_channel = 'London';
var send_debug_logs_timeout;
var mask_disconnection = false;
var sleep_worker;
var player_started = false;
var ping_worker;
var stats_worker;
var reconnect_worker;
var soundmeter_worker;
var socket_worker;
var audioCtx;
var track;
var analyser;
var bufferLength;
var dataArray;
var restart_happening = false;
var restart_happening_timout;
var no_packets_received_count = 0;
var instant_restart_count = 0;
var connection_start_time = 0;
var wake_interval;
var wake_lasttime = 0;
var boot_cycle_time = 120000;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
$(document).ready(function() {
    set_webrtc_settings_values();
    $('#sdp_url').html(wsURL);
    $('#application_name').html(streamInfo.applicationName);
    $('#stream_name').html(streamInfo.streamName);
    console.log('reconnect_worker');
    if (reconnect_worker == undefined) {
        var reconnect_worker_code = document.getElementById('ls_reconnect_worker').textContent;
        var reconnect_worker_blob = new Blob([reconnect_worker_code], {
            type: 'application/javascript'
        });
        var reconnect_worker_url = URL.createObjectURL(reconnect_worker_blob);
        reconnect_worker = new Worker(reconnect_worker_url);
        URL.revokeObjectURL(reconnect_worker_url);
        document.getElementById('ls_reconnect_worker').remove();
    }
    load_stats_worker();
    load_soundmeter_worker();
    check_boot();
    restarts_click();
});

function restarts_click() {
    $(document).on("click", "#instant_restart_count, .new_webrtc_version", function(event) {
        event.preventDefault();
        $('.new_webrtc__debug__outer').toggle().toggleClass('open');
        $('.header').toggleClass('debug_open');
        $('#content_outer').toggleClass('debug_open');
    });
}

function check_boot() {
    console.log('checked_boot');
    var sess = new Date();
    var nocache = sess.getTime();
    var boot_url = "";
    if (typeof sess_id !== 'undefined') {
        boot_url = "https://www.livesquawk.com/player/ajax/new_partner_boot.php?time=" + nocache + "&product=" + product + "&sess_id=" + sess_id;
    } else {
        boot_url = "https://www.livesquawk.com/player/ajax/boot.php?time=" + nocache + "&product=" + product;
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
                setTimeout(check_boot, boot_cycle_time);
            }
        }
    });
}

function media_keys() {
    $(document).on('keydown', function(event) {
        if (event.code === 'MediaPlayPause') {
            alert('Play/Pause');
        }
        if (event.code === 'MediaStop') {
            alert('Stop');
        }
        if (event.code === 'MediaTrackPrevious') {
            alert('Previous Track');
        }
        if (event.code === 'MediaTrackNext') {
            alert('Next Track');
        }
        if (event.code === 'VolumeUp') {
            alert('Volume Up');
        }
        if (event.code === 'VolumeDown') {
            alert('Volume Down');
        }
        if (event.code === 'VolumeMute') {
            alert('Volume Mute');
        }
    });
}

function woke_up_click() {
    $(document).on("click", ".webrtc_woke_up", function(event) {
        write_to_visible_console("I just woke up");
        restart_happening = true;
        instant_reconnection_attempt();
    });
}

function load_soundmeter_worker() {
    console.log('soundmeter_worker');
    if (soundmeter_worker == undefined) {
        var soundmeter_worker_code = document.getElementById('ls_soundmeter_worker').textContent;
        var soundmeter_worker_blob = new Blob([soundmeter_worker_code], {
            type: 'application/javascript'
        });
        var soundmeter_worker_url = URL.createObjectURL(soundmeter_worker_blob);
        soundmeter_worker = new Worker(soundmeter_worker_url);
        URL.revokeObjectURL(soundmeter_worker_url);
        document.getElementById('ls_soundmeter_worker').remove();
        soundmeter_worker.onmessage = function(msg) {
            if (msg.data.action == "RequestAnalyser") {
                analyser.getByteFrequencyData(dataArray);
                soundmeter_worker.postMessage({
                    action: 'SendAnalyser',
                    analyser_array: dataArray
                });
            } else if (msg.data.action == "AnalyserAverage") {
                var width_pc = (msg.data.analyser_average / 2).toFixed(2);
                if (msg.data.analyser_average >= silence_level) {
                    $('.volume_bar_inner').css({
                        width: width_pc + "%"
                    });
                    if (!currently_sound) {
                        $('.webrtc__player__icon').addClass('player__icon--sound');
                        currently_sound = true;
                    }
                    if (silence_timeout != null) {
                        clearTimeout(silence_timeout);
                        silence_timeout = null;
                    }
                } else {
                    $('.volume_bar_inner').css({
                        width: "0%"
                    });
                    if (currently_sound && silence_timeout == null) {
                        silence_timeout = setTimeout(function() {
                            currently_sound = false;
                            $('.webrtc__player__icon').removeClass('player__icon--sound');
                        }, silence_time);
                    }
                }
            }
        };
    }
}

function load_stats_worker() {
    console.log('stats_worker');
    if (stats_worker == undefined) {
        var stats_worker_code = document.getElementById('ls_stats_worker').textContent;
        var stats_worker_blob = new Blob([stats_worker_code], {
            type: 'application/javascript'
        });
        var stats_worker_url = URL.createObjectURL(stats_worker_blob);
        stats_worker = new Worker(stats_worker_url);
        URL.revokeObjectURL(stats_worker_url);
        document.getElementById('ls_stats_worker').remove();
        stats_worker.onmessage = function(event) {
            if (event.data.action == 'RequestStats') {
                try {
                    peerConnection.getStats(null).then(function(stats) {
                        stats.forEach(function(res) {
                            if (res.type == 'remote-candidate' || res.type == 'inbound-rtp' || (res.type == 'candidate-pair' && res.state == 'succeeded')) {
                                stats_worker.postMessage({
                                    action: 'SendStats',
                                    stats_result: res,
                                    ping_time: ping_time
                                });
                            }
                        });
                    });
                } catch (e) {}
                update_connected_for();
            } else if (event.data.action == 'StatsString') {
                event.data.stats_string = event.data.stats_string.replace(/~~/g, '<br>');
                $('#webrtc_stats').html(event.data.stats_string);
            } else if (event.data.action == 'Protocol') {
                protocol = event.data.protocol;
                $('#protocol').html(protocol);
            } else if (event.data.action == 'Jitter') {
                average_jitter = event.data.average_jitter;
            } else if (event.data.action == 'AverageLost') {
                average_packets_lost_last_10 = event.data.average_packets_lost;
                if (average_packets_lost_last_10 > 2) {
                    $('#packets_lost').addClass('warning');
                    if (!is_muted) {
                        $('#longer_off_air_text').html("High Packet Loss - Please check your network connection - See <a href='https://www.livesquawk.com/webrtc/player/websockets_error_help.php' target='_blank'>notes</a>");
                    }
                } else {
                    $('#packets_lost').removeClass('warning');
                    if (!is_muted) {
                        $('#longer_off_air_text').html("");
                    }
                }
                $('#packets_lost').html("PL:" + average_packets_lost_last_10 + "%");
            } else if (event.data.action == 'LastPacketError') {
                write_to_visible_console("No Packets Received");
                if (restart_happening || no_packets_received_count > 5) {
                    instant_reconnection_attempt();
                }
                no_packets_received_count++;
            } else if (event.data.action == 'MeanOpinionScore') {
                mean_opinion_score = event.data.mean_opinion_score;
                effective_latency = event.data.effective_latency;
                display_mean_opinion_score();
            }
        };
    }
}

function start_stats_worker() {
    if (stats_worker != undefined) {
        stats_worker.postMessage({
            action: 'StartStats'
        });
    }
}

function stop_stats_worker() {
    if (stats_worker != undefined) {
        stats_worker.postMessage({
            action: 'StopStats'
        });
    }
}

function start_socket_worker() {
    console.log('socket_worker');
    if (socket_worker == undefined) {
        var socket_worker_code = document.getElementById('ls_socket_worker').textContent;
        var socket_worker_blob = new Blob([socket_worker_code], {
            type: 'application/javascript'
        });
        var socket_worker_url = URL.createObjectURL(socket_worker_blob);
        socket_worker = new Worker(socket_worker_url);
        URL.revokeObjectURL(socket_worker_url);
        document.getElementById('ls_socket_worker').remove();
        socket_worker.postMessage({
            action: 'ConnectDistributor',
            publisher_channel: publisher_channel
        });
        socket_worker.onmessage = function(event) {
            if (event.data.action == 'VisibleConsole') {
                write_to_visible_console(event.data.console_string);
            } else if (event.data.action == "RequestSessionStaticInfo") {
                if (!is_muted) {
                    $('#longer_off_air_text').removeClass('muted medium').html("");
                }
                socket_worker.postMessage({
                    action: 'SessionStaticInfo',
                    browser_codename: navigator.appCodeName,
                    browser_name: adapter.browserDetails.browser,
                    user_agent: navigator.userAgent,
                    browser_version: adapter.browserDetails.version,
                    cookies_enabled: navigator.cookieEnabled,
                    platform: navigator.platform,
                    player_version: player_version_no,
                    stream: streamInfo.streamName,
                    protocol: protocol,
                    delay_target: 0,
                    session_email: $('#username_value').text(),
                    remote_ip: remote_ip,
                    php_session_id: php_session_id,
                    application_name: streamInfo.applicationName,
                    http_referrer: http_referrer
                });
            } else if (event.data.action == "RequestSessionInfo") {
                socket_worker.postMessage({
                    action: 'SessionInfo',
                    protocol: protocol,
                    effective_latency: effective_latency,
                    ping_time: ping_time,
                    jitter: average_jitter,
                    packet_loss: average_packets_lost_last_10,
                    mean_opinion_score: mean_opinion_score,
                    restarts: instant_restart_count
                });
            } else if (event.data.action == "ApplicationRefreshStart") {
                mask_disconnection = true;
                write_to_visible_console('Application Refresh Start');
                disconnect_from_server();
                is_off_air();
            } else if (event.data.action == "ApplicationRefreshStop") {
                write_to_visible_console('Application Refresh Stop');
                write_to_visible_console("Reconnection Attempt");
                wsConnection_start();
            } else if (event.data.action == "Reload") {
                document.cookie = "reload_restart=true";
            } else if (event.data.action == "LSSocketConnectionError") {
                $('#longer_off_air_text').html("Logging Error - Please check your network connection - See <a href='https://www.livesquawk.com/webrtc/player/websockets_error_help.php' target='_blank'>notes</a>");
            }
        };
    } else {
        socket_worker.postMessage({
            action: 'RestartLogging',
            publisher_channel: publisher_channel
        });
    }
}
$(window).on('beforeunload', function() {
    disconnect_from_server();
    if (stats_worker != undefined) {
        stats_worker.terminate();
        stats_worker = null;
    }
    if (sleep_worker != undefined) {
        sleep_worker.terminate();
        sleep_worker = null;
    }
    if (ping_worker != undefined) {
        ping_worker.terminate();
        ping_worker = null;
    }
    if (socket_worker != undefined) {
        socket_worker.terminate();
        socket_worker = null;
    }
    if (reconnect_worker != undefined) {
        reconnect_worker.terminate();
        reconnect_worker = null;
    }
    stop_soundmeter();
});

function start_without_click() {
    $('.webrtc__player__onair__text').html('Connecting');
    $('.webrtc__player__middle').append("<audio class='audio_player' id='remoteVideo' playsinline webkit-playsinline='true'></audio>");
    remoteVideo = document.getElementById('remoteVideo');
    if (peerConnection == null) {
        wsConnection_start();
    } else {
        disconnect_from_server();
    }
    $('#instant_restart_count').html("R:" + instant_restart_count);
}

function start_button_click() {
    $(document).on("click", ".start_button", function(event) {
        event.preventDefault();
        $('.webrtc__player__onair__text').html('Connecting');
        $('.webrtc__player__middle').append("<audio class='audio_player' id='remoteVideo' playsinline webkit-playsinline='true'></audio>");
        remoteVideo = document.getElementById('remoteVideo');
        if (peerConnection == null) {
            wsConnection_start();
        } else {
            disconnect_from_server();
        }
        $('#instant_restart_count').html("R:" + instant_restart_count);
    });
}

function start_sleep_worker() {
    console.log('sleep_worker');
    if (sleep_worker == undefined) {
        sleep_worker = new Worker("https://www.livesquawk.com/js/sleep_worker.js");
        sleep_worker.onmessage = function(event) {
            if (player_started && event.data == 'I just woke up') {
                write_to_visible_console("I just woke up");
                restart_happening = true;
                instant_reconnection_attempt();
            } else if (player_started && event.data == 'Checked if asleep') {
                write_to_visible_console("Checked if asleep");
            }
        };
    }
}
var check_sleep_interval = 10000;

function new_start_sleep_worker() {
    var currentTime = (new Date()).getTime();
    if (wake_lasttime != 0 && currentTime > (wake_lasttime + (check_sleep_interval * 1.2))) {
        write_to_visible_console("I just woke up");
    } else {
        write_to_visible_console("Checked if asleep");
    }
    wake_lasttime = currentTime;
    setTimeout(new_start_sleep_worker, check_sleep_interval);
}

function start_soundmeter_worker() {
    if (soundmeter_worker != undefined) {
        soundmeter_worker.postMessage({
            action: 'StopSoundmeter'
        });
    }
    if (audioCtx != undefined) {
        audioCtx.close();
        audioCtx = null;
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    track = audioCtx.createMediaStreamSource(remoteVideo.srcObject);
    analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 128;
    bufferLength = analyser.frequencyBinCount;
    track.connect(analyser);
    dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    soundmeter_worker.postMessage({
        action: 'StartSoundmeter'
    });
}

function stop_soundmeter() {
    if (soundmeter_worker != undefined) {
        soundmeter_worker.postMessage({
            action: 'StopSoundmeter'
        });
    }
    if (audioCtx != undefined) {
        audioCtx.close();
        audioCtx = null;
    }
    $('.volume_bar_inner').css({
        width: "0%"
    });
    $('.webrtc__player__icon').removeClass('player__icon--sound');
}

function start_server_ping_worker() {
    console.log('ping_worker');
    if (ping_worker == undefined) {
        var ping_worker_code = document.getElementById('ls_ping_worker').textContent;
        var ping_worker_blob = new Blob([ping_worker_code], {
            type: 'application/javascript'
        });
        var ping_worker_url = URL.createObjectURL(ping_worker_blob);
        ping_worker = new Worker(ping_worker_url);
        URL.revokeObjectURL(ping_worker_url);
        document.getElementById('ls_ping_worker').remove();
        ping_worker.onmessage = function(event) {
            ping_time = event.data;
            $('#ping_time').html("L:" + ping_time + "ms");
            var formattedTime = get_formatted_time();
            $('.webrtc_pings').append("<div class='ping'>" + formattedTime + " Streaming Server Ping = " + ping_time + "ms</div><br>");
            check_remove_pings();
        };
    }
}

function set_webrtc_settings_values() {
    if (adapter.browserDetails.browser == 'Not a supported browser.') {
        $('.webrtc__player__middle').html("<div class='not_supported'>WebRTC Audio is not available on this browser</div>");
    }
    $("#user_agent").html(capitalize(adapter.browserDetails.browser));
    $('#sdpURL').val(wsURL);
    $('#applicationName').val(streamInfo.applicationName);
    $('#streamName').val(streamInfo.streamName);
}

function wsConnection_start() {
    write_to_visible_console("wsConnection_start");
    if (wsConnection == undefined) {
        write_to_visible_console("wsConnection was undefined");
        wsConnection = new WebSocket(wsURL);
        wsConnection.binaryType = 'arraybuffer';
        wsConnection.onopen = wsConnection_onopen;
        wsConnection.onclose = function() {
            write_to_visible_console("WebSocket is closed now");
            wsConnection = null;
            wsConnection_reOpen();
        };
        wsConnection.onerror = wsConnection_error;
        wsConnection.onmessage = wsConnection_onmessage;
    } else {
        write_to_visible_console("wsConnection was defined");
        peerConnection = null;
        peerConnection = new RTCPeerConnection(peerConnectionConfig);
        peerConnection.onicecandidate = peerConnection_gotIceCandidate;
        peerConnection.oniceconnectionstatechange = peerConnection_onIceConnectionStateChange;
        peerConnection.onsignalingstatechange = peerConnection_onSignalingStateChange;
        peerConnection.onnegotiationneeded = peerConnection_onNegotiationNeeded;
        peerConnection.onconnectionstatechange = peerConnection_onConnectionStateChange;
        peerConnection.ontrack = peerConnection_gotRemoteTrack;
        wsConnection.send('{"direction":"play", "command":"getOffer", "streamInfo":' + JSON.stringify(streamInfo) + ', "userData":' + JSON.stringify(userData) + '}');
    }
    write_to_visible_console("end of wsConnection_start");
}

function wsConnection_reOpen() {
    write_to_visible_console("WebSocket Re-Open Attempt");
    wsConnection = new WebSocket(wsURL);
    wsConnection.binaryType = 'arraybuffer';
    wsConnection.onopen = wsConnection_onreopen;
    wsConnection.onclose = function() {
        write_to_visible_console("WebSocket is closed now");
        wsConnection = null;
        wsConnection_reOpen();
    };
    wsConnection.onerror = wsConnection_error;
    wsConnection.onmessage = wsConnection_onmessage;
}

function wsConnection_onreopen(event) {
    write_to_visible_console("wsConnection_reopened");
}

function wsConnection_onopen(event) {
    write_to_visible_console("wsConnection_onopen");
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = peerConnection_gotIceCandidate;
    peerConnection.oniceconnectionstatechange = peerConnection_onIceConnectionStateChange;
    peerConnection.onsignalingstatechange = peerConnection_onSignalingStateChange;
    peerConnection.onnegotiationneeded = peerConnection_onNegotiationNeeded;
    peerConnection.onconnectionstatechange = peerConnection_onConnectionStateChange;
    peerConnection.ontrack = peerConnection_gotRemoteTrack;
    wsConnection.send('{"direction":"play", "command":"getOffer", "streamInfo":' + JSON.stringify(streamInfo) + ', "userData":' + JSON.stringify(userData) + '}');
}

function wsConnection_onmessage(event) {
    var event_data = JSON.parse(event.data);
    var event_status = Number(event_data.status);
    write_to_visible_console("wsConnection.onmessage.status: " + event_status + " " + event_data.command + " " + event_data.statusDescription);
    if (event_status != 200) {
        if (event_status == 502 && event_data.statusDescription.indexOf('Live stream is not running') !== false) {
            write_to_visible_console("Stream is not currently broadcasting");
            $('#longer_off_air_text').addClass('medium').html('Stream is not currently broadcasting<br>Automatic reconnection attempt every 20 seconds');
            start_reconnect_worker(20000);
        } else if (event_status == 502 && event_data.statusDescription.indexOf('Stream is not ready') !== false) {
            $('#longer_off_air_text').addClass('medium').html('Stream is not currently broadcasting<br>Automatic reconnection attempt every 2 seconds');
            start_reconnect_worker(2000);
        } else if (event_data.statusDescription.indexOf('Waiting for') !== false) {
            $('#longer_off_air_text').addClass('medium').html('Stream is not currently broadcasting<br>Automatic reconnection attempt every 2 seconds');
            start_reconnect_worker(2000);
        }
        disconnect_from_server();
    } else {
        if (event_data.streamInfo !== undefined) {
            streamInfo.sessionId = event_data.streamInfo.sessionId;
        }
        if (event_data.sdp !== undefined) {
            if (peerConnection != undefined) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(event_data.sdp), function() {
                    peerConnection.createAnswer(peerConnection_gotDescription, peerConnection_errorHandler);
                }, peerConnection_errorHandler);
            } else {
                write_to_visible_console("peerConnection not here already");
            }
        }
        if (event_data.iceCandidates !== undefined) {
            for (var index in event_data.iceCandidates) {
                if (peerConnection != undefined) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(event_data.iceCandidates[index])).then(peerConnection_addIceCandidateSuccess, peerConnection_addIceCandidateRejected);
                } else {
                    write_to_visible_console("peerConnection not here already");
                }
            }
        }
    }
    if (event_data.command == 'sendResponse' && wsConnection != null) {}
}

function peerConnection_addIceCandidateSuccess() {}

function peerConnection_addIceCandidateRejected(error) {
    console.log('addIceCandidateRejected');
    write_to_visible_console("addIceCandidateRejected");
    console.log(error);
}

function wsConnection_error(event) {
    write_to_visible_console("<span class='error_red'>You are currently unable to connect to our Websockets server which will prevent you using the player.  <a href='https://www.livesquawk.com/webrtc/player/websockets_error_help.php' target='_blank'>Please refer to these notes on how to diagnose and resolve the issue.</a><span>");
    write_to_visible_console("wsConnection.onerror: " + JSON.stringify(event, ['message', 'arguments', 'type', 'name', 'data']));
    $('#longer_off_air_text').html("You are currently unable to connect to our services.<br><a href='https://www.livesquawk.com/webrtc/player/websockets_error_help.php' target='_blank'>Please refer to these notes on how to diagnose and resolve the issue.</a>").addClass('medium');
    start_reconnect_worker(20000);
}

function peerConnection_onIceConnectionStateChange() {
    write_to_visible_console("IceConnectionState: " + peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState == "disconnected") {
        peerConnection_disconnected();
    } else if (peerConnection.iceConnectionState == "failed" || peerConnection.iceConnectionState == "closed") {
        peerConnection_failed_closed();
    } else if (peerConnection.iceConnectionState == 'connected') {
        peerConnection_connected();
    }
}

function peerConnection_onConnectionStateChange() {
    write_to_visible_console("PeerConnection StateChange: " + peerConnection.connectionState);
}

function peerConnection_onNegotiationNeeded(event) {
    write_to_visible_console("Negotiation Needed");
}

function peerConnection_disconnected() {
    write_to_visible_console("Stream Disconnected");
    restart_happening = true;
    instant_reconnection_attempt();
}

function instant_reconnection_attempt() {
    clearTimeout(restart_happening_timout);
    restart_happening_timout = null;
    write_to_visible_console("Instant Reconnect Attempt");
    instant_restart_count++;
    $('#instant_restart_count').html("R:" + instant_restart_count);
    off_air = true;
    stop_stats_worker();
    peerConnection.close();
    peerConnection = null;
    wsConnection_start();
}

function webrtc_restart_click() {
    $(document).on("click", ".webrtc_restart", function(event) {
        off_air = true;
        write_to_visible_console("Restart Requested in 10 seconds");
        setTimeout(function() {
            restart_happening = true;
            instant_reconnection_attempt();
        }, 10000);
    });
}

function peerConnection_failed_closed() {
    $('#longer_off_air_text').html("Automatic Reconnection");
    write_to_visible_console("Failed");
    start_reconnect_worker(1000);
}

function peerConnection_connected() {
    write_to_visible_console("peerConnection_connected");
    clearTimeout(send_debug_logs_timeout);
    send_debug_logs_timeout = null;
    try {
        remoteVideo.play();
    } catch (err) {
        write_to_visible_console("remoteVideo.play error" + err);
    }
    is_on_air();
    player_started = true;
    start_stats_worker();
    start_socket_worker();
    start_server_ping_worker();
    if (!is_muted) {
        try {
            start_soundmeter_worker();
        } catch (e) {
            console.log(e);
        }
    }
}

function peerConnection_gotIceCandidate(event) {
    if (event.candidate != null) {}
}

function peerConnection_gotDescription(description) {
    write_to_visible_console("peerConnection_gotDescription");
    peerConnection.setLocalDescription(description, function() {
        wsConnection.send('{"direction":"play", "command":"sendResponse", "streamInfo":' + JSON.stringify(streamInfo) + ', "sdp":' + JSON.stringify(description) + ', "userData":' + JSON.stringify(userData) + '}');
    }, function() {
        write_to_visible_console("Set Description Error");
    });
}

function peerConnection_onSignalingStateChange(event) {
    write_to_visible_console("peerConnection Signaling StateChange: " + peerConnection.signalingState);
}

function peerConnection_gotRemoteTrack(event) {
    write_to_visible_console("Got Remote Track");
    try {
        remoteVideo.srcObject = event.streams[0];
    } catch (error) {
        remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
        write_to_visible_console("peerConnection_gotRemoteTrack Error");
    }
}

function peerConnection_errorHandler(error) {
    console.log(error);
}

function disconnect_from_server() {
    stop_stats_worker();
    if (peerConnection != undefined) {
        peerConnection.close();
        peerConnection = null;
    }
    if (wsConnection != undefined) {}
    if (remoteVideo != undefined) {
        remoteVideo.src = "";
    }
    if (socket_worker != undefined) {
        socket_worker.postMessage({
            action: 'PauseLogging'
        });
    }
    if (!mask_disconnection) {
        write_to_visible_console("Disconnected from Server");
    }
    stop_soundmeter();
}

function start_reconnect_worker(frequency) {
    stop_stats_worker();
    is_off_air();
    reconnect_worker.postMessage({
        action: 'StartCheckAvailable',
        server_ip: server_ip,
        app_name: streamInfo.applicationName,
        stream_name: streamInfo.streamName,
        frequency: frequency
    });
    reconnect_worker.onmessage = function(msg) {
        if (msg.data.action == "ReconnectAttempt") {
            write_to_visible_console("Reconnection Attempt");
        }
        if (msg.data.action == "ClientOffline") {
            write_to_visible_console("Client Offline");
        } else if (msg.data.action == "Reconnect") {
            setTimeout(function() {
                wsConnection_start();
                write_to_visible_console("Reconnect");
            }, 3000);
            clearTimeout(send_debug_logs_timeout);
            send_debug_logs_timeout = null;
        }
    };
}

function peerConnection_getstats_error(e) {
    e = e + "";
    if (e.indexOf('RTCPeerConnection is gone') !== false) {
        if (!mask_disconnection) {
            write_to_visible_console("RTCPeerConnection is gone");
        }
    } else {
        write_to_visible_console(e);
    }
    return false;
}

function is_on_air() {
    if (off_air) {
        off_air = false;
        $('.webrtc__player__icon').addClass('player__icon--on-no-speaking').removeClass('player__icon--sim_sound');
        $('.new_webrtc_player__outer').removeClass('webrtc__player__outer--buffering').addClass('webrtc__player__outer--connected');
        $('.webrtc__player__onair__text').html('LIVE');
        $('.webrtc__player__middle').addClass('webrtc__player__middle--on-air');
        write_to_visible_console("Stream Connected");
        if (restart_happening) {
            restart_happening_timout = setTimeout(function() {
                restart_happening = false;
            }, 5000);
        }
        $('#longer_off_air_text').html('').removeClass('muted medium');
        no_packets_received_count = 0;
        new_volume();
        if (!mask_disconnection && !restart_happening) {
            var d = new Date();
            connection_start_time = (d.getTime() / 1000).toFixed(0);
        }
        if (mask_disconnection) {
            mask_disconnection = false;
        }
    }
}

function is_off_air() {
    if (!off_air || start_off_air == true) {
        $('.webrtc__player__icon').removeClass('player__icon--sim_sound');
        if (!mask_disconnection) {
            write_to_visible_console("No incoming stream");
            $('.webrtc__player__icon').removeClass('player__icon--on-no-speaking');
            $('.new_webrtc_player__outer').removeClass('webrtc__player__outer--connected webrtc__player__outer--buffering');
            $('.webrtc__player__onair__text').html('OFF AIR');
            $('.webrtc__player__middle').removeClass('webrtc__player__middle--on-air');
        } else {}
        off_air = true;
        start_off_air = false;
    }
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

function write_to_visible_console(msg) {
    var formattedTime = get_formatted_time();
    $('#console_log').append("<div class='log'>" + formattedTime + " " + msg + "</div><br>");
    if ($('#console_log .log').not('.removing').length > 40) {
        $('#console_log .log').not('.removing').first().addClass('removing').slideUp('normal', function() {});
    }
}

function get_formatted_time() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var milliseconds = "0" + date.getMilliseconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds.substr(-2);
    return formattedTime;
}

function check_remove_pings() {
    if ($('.webrtc_pings .ping').not('.removing').length > 5) {
        $('.webrtc_pings .ping').not('.removing').first().addClass('removing').slideUp('normal', function() {
            $(this).remove();
        });
    }
}

function display_mean_opinion_score() {
    $('#mean_opinion_score').html("MOS:" + mean_opinion_score.toFixed(1));
    if (mean_opinion_score >= 1) {
        $('.qos_bar--one .qos_bar_inner').css({
            width: "100%"
        });
    } else {
        $('.qos_bar--one .qos_bar_inner').css({
            width: (mean_opinion_score * 100).toFixed(1) + "%"
        });
    }
    if (mean_opinion_score >= 2) {
        $('.qos_bar--two .qos_bar_inner').css({
            width: "100%"
        });
    } else if (mean_opinion_score >= 1) {
        $('.qos_bar--two .qos_bar_inner').css({
            width: ((mean_opinion_score - 1) * 100).toFixed(1) + "%"
        });
    } else {
        $('.qos_bar--two .qos_bar_inner').css({
            width: "0%"
        });
    }
    if (mean_opinion_score >= 3) {
        $('.qos_bar--three .qos_bar_inner').css({
            width: "100%"
        });
    } else if (mean_opinion_score >= 2) {
        $('.qos_bar--three .qos_bar_inner').css({
            width: ((mean_opinion_score - 2) * 100).toFixed(1) + "%"
        });
    } else {
        $('.qos_bar--three .qos_bar_inner').css({
            width: "0%"
        });
    }
    if (mean_opinion_score >= 4) {
        $('.qos_bar--four .qos_bar_inner').css({
            width: "100%"
        });
    } else if (mean_opinion_score >= 3) {
        $('.qos_bar--four .qos_bar_inner').css({
            width: ((mean_opinion_score - 3) * 100).toFixed(1) + "%"
        });
    } else {
        $('.qos_bar--four .qos_bar_inner').css({
            width: "0%"
        });
    }
    if (mean_opinion_score >= 5) {
        $('.qos_bar--five .qos_bar_inner').css({
            width: "100%"
        });
    } else if (mean_opinion_score >= 4) {
        $('.qos_bar--five .qos_bar_inner').css({
            width: ((mean_opinion_score - 4) * 100).toFixed(1) + "%"
        });
    } else {
        $('.qos_bar--five .qos_bar_inner').css({
            width: "0%"
        });
    }
}

function set_send_debug_logs_timeout() {
    send_debug_logs_timeout = setTimeout(function() {
        send_debug_logs();
        write_to_visible_console("Debug Logs Sent");
    }, 10000);
}

function send_logs_click() {
    $(document).on("click", ".webrtc_send_logs", function(event) {
        send_debug_logs();
        console.log('logs_sent');
        $('.webrtc_send_logs').html('Sent');
        setTimeout(function() {
            $('.webrtc_send_logs').html('Send Logs');
        }, 2000);
    });
}

function send_debug_logs() {
    var from_app = 'Test Player Macro';
    var current_logs = encodeURIComponent($('#console_log').html());
    var current_pings = encodeURIComponent($('.webrtc_pings').html());
    $.ajax({
        method: "GET",
        url: 'https://www.livesquawk.com/webrtc/ajax/notification.php',
        data: {
            current_logs: current_logs,
            from_app: from_app,
            current_pings: current_pings
        },
        cache: false,
        success: function(data) {}
    });
}

function capitalize(s) {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function new_volume() {
    $(document).off("click", ".webrtc__volume_mute_icons--active");
    $(document).off("click", ".webrtc__volume_mute_icons--muted");
    var c_value = getCookie();
    if (c_value == 999) {
        c_value = 75;
        setCookie(75);
    }
    if (c_value > 100) {
        c_value = 100;
        setCookie(100);
    }
    $('.webrtc__volume__progress').width(c_value + "%");
    $('.webrtc__volume__knob').css({
        "left": c_value + "%"
    });
    volume_width = $('.webrtc__volume__inner').innerWidth();
    vol_level = (c_value / 100);
    remoteVideo.volume = vol_level;
    if (vol_level == 0) {
        remoteVideo.muted = true;
        is_muted = true;
        stop_soundmeter();
        $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
        $('#longer_off_air_text').addClass('muted').removeClass('medium').html("MUTED");
    } else {
        $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
        remoteVideo.muted = false;
        $('#longer_off_air_text').html("").removeClass('muted medium');
        is_muted = false;
        try {
            start_soundmeter_worker();
        } catch (e) {}
    }
    $(document).on("click", ".webrtc__volume_mute_icons--active", function(event) {
        pre_muted_volume = vol_level;
        remoteVideo.muted = true;
        is_muted = true;
        $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
        vol_level = 0;
        remoteVideo.volume = vol_level;
        $('.webrtc__volume__progress').width((vol_level * 100) + '%');
        $(".webrtc__volume__knob").css("left", (vol_level * 100) + '%');
        setCookie(0);
        if (!is_muted) {
            stop_soundmeter();
        }
        $('#longer_off_air_text').addClass('muted').removeClass('medium').html("MUTED");
    });
    $(document).on("click", ".webrtc__volume_mute_icons--muted", function(event) {
        remoteVideo.muted = false;
        is_muted = false;
        $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
        vol_level = pre_muted_volume;
        remoteVideo.volume = vol_level;
        $('.webrtc__volume__progress').width((vol_level * 100) + '%');
        $(".webrtc__volume__knob").css("left", (vol_level * 100) + '%');
        setCookie(vol_level * 100);
        try {
            start_soundmeter_worker();
        } catch (e) {}
        $('#longer_off_air_text').html("").removeClass('muted medium');
    });
    $(".webrtc__volume__inner").mouseleave(function() {
        $('.webrtc__volume__knob').trigger('dragstop').trigger('mouseup');
    });
    $(".webrtc__volume__knob").draggable({
        axis: "x",
        containment: ".webrtc__volume__inner",
        scroll: false,
        drag: function() {
            var xPos = $(this).position().left;
            vol_level = xPos / volume_width;
            var real_vol_level = vol_level;
            if (real_vol_level > 0.5) {
                xPos = xPos + 8;
                real_vol_level = xPos / volume_width;
            }
            if (vol_level < 0.05) {
                vol_level = 0;
            }
            if (real_vol_level < 0.05) {
                real_vol_level = 0;
            }
            if (vol_level > 0.95) {
                vol_level = 1;
            }
            if (real_vol_level > 0.95) {
                real_vol_level = 1;
            }
            if (vol_level == 0) {
                remoteVideo.muted = true;
                $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
                if (!is_muted) {
                    stop_soundmeter();
                }
                $('#longer_off_air_text').addClass('muted').removeClass('medium').html("MUTED");
                is_muted = true;
            } else {
                if (is_muted) {
                    $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
                    remoteVideo.muted = false;
                    try {
                        start_soundmeter_worker();
                    } catch (e) {}
                    $('#longer_off_air_text').html("").removeClass('muted medium');
                    is_muted = false;
                }
            }
            $('.webrtc__volume__progress').width((vol_level * 100) + '%');
            remoteVideo.volume = vol_level;
        },
        stop: function() {
            var xPos = $(this).position().left;
            vol_level = xPos / volume_width;
            var real_vol_level = vol_level;
            if (real_vol_level > 0.5) {
                xPos = xPos + 8;
                real_vol_level = xPos / volume_width;
            }
            if (vol_level < 0.05) {
                vol_level = 0;
            }
            if (real_vol_level < 0.05) {
                real_vol_level = 0;
            }
            if (vol_level == 0) {
                remoteVideo.muted = true;
                $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
                if (!is_muted) {
                    stop_soundmeter();
                }
                $('#longer_off_air_text').addClass('muted').removeClass('medium').html("MUTED");
                is_muted = true;
            } else {
                if (is_muted) {
                    $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
                    remoteVideo.muted = false;
                    try {
                        start_soundmeter_worker();
                    } catch (e) {}
                    $('#longer_off_air_text').html("").removeClass('muted medium');
                    is_muted = false;
                }
            }
            if (vol_level > 0.95) {
                vol_level = 1;
            }
            if (real_vol_level > 0.95) {
                real_vol_level = 1;
            }
            $('.webrtc__volume__progress').width((vol_level * 100) + '%');
            remoteVideo.volume = vol_level;
            $(this).css("left", (vol_level * 100) + '%');
            setCookie(real_vol_level * 100);
        }
    });
}

function update_connected_for() {
    var d = new Date();
    var n = d.getTime();
    var s = (n / 1000).toFixed(0) - connection_start_time;
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var m = Math.floor(s / 60);
    s -= m * 60;
    var output_string = h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
    $('#connected_time').html(output_string);
}