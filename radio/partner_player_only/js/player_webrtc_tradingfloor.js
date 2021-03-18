var remoteVideo = null;
var peerConnection = null;
var peerConnectionConfig = {'iceServers': []};
// var peerConnectionConfig = {'iceServers': [{"urls":"turn:52.208.14.5", username: "pip", credential: "0x45ce0eb8ec0506df8f25f204cb2ce8e2"}]};
var localStream = null;
var wsURL = "wss://5ec3b203a6241.streamlock.net/webrtc-session.json";
var wsConnection = null;
var streamInfo = { applicationName:"webrtc", streamName:"tradingfloor_webrtc", sessionId:"[empty]" };
var userData = {param1:"value1"};
var repeaterRetryCount = 0;
var newAPI = false;
var doGetAvailableStreams = false;
var stats_interval;
var stats_interval_time = 2000;
var sound_meter_interval; 
var restart_internval;
var restart_check_time = 20000; 
var ice_connection_state = ''; 
var last_packet_timestamp = 0;
var last_packet_max_diff = 2000;
var webrtc_off_air = true;
var start_off_air = true; 
var currently_sound = false; 
var silence_level = 0.1;
var silence_time = 500;
var silence_timeout = null;
var volume_width = 0;
var webrtc_vol_level = 0.75; 
var pre_muted_volume = 0.75; 
var is_muted = true;
var rttMeasures = [];
var aBit = 1000; // in milliseconds
var packets_lost_last_10 = [];
var last_packets_lost = 0; 
var average_packets_lost_last_10 = 0;
var ping_time = 0;
var ping_time_interval = 60000;
var ping_interval = null; 
var jitter_last_10 = [];
var average_jitter = 0;
var protocol = '';
var username = '';

var last_packets_received = 0;
var received_since_last = 0;

var effective_latency = 0;
var r = 93.2;
var mean_opinion_score = 0;


var webrtc_assigned_server = 3001; 
var webrtc_distributor_server = 3010;
var current_server = 0;
var session_info = {};
var player_version_no = "WebRTC0.9";

var publisher_channel = 'London'; 
var logging_interval;
var logging_interval_time = 30000;
var socket_emits = 0;

var connection_start_time = 0;
var connection_interval; 
var connection_interval_time = 1000; 


const capitalize = (s) => {
  if (typeof s !== 'string') { return ''; }
  return s.charAt(0).toUpperCase() + s.slice(1)
}

window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;


function post_client_server_connection_functions() {
  
  doGetAvailableStreams = false;
	if (peerConnection == null) { startPlay(); }
	else { stopPlay(); }
  
	remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.play();
  set_static_session_info();
  webrtc_new_volume();
  send_logs_click(); 

  $('#sdpURL').html(wsURL);
	$('#application_name').html(streamInfo.applicationName);
	$('#stream_name').html(streamInfo.streamName);


	if(navigator.mediaDevices.getUserMedia) { newAPI = false; }
  newAPI = true; 

  
}



function update_connected_for() {
  var d = new Date();
  var n = d.getTime();
  var s = (n/1000).toFixed(0) - connection_start_time;
  var h = Math.floor(s/3600); //Get whole hours
  s -= h*3600;
  var m = Math.floor(s/60); //Get remaining minutes
  s -= m*60;
  var output_string = h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);  
  $('#connected_time').html(output_string);
}

function send_logs_click() {
  $(document).on("click","#webrtc_protocol",function(event) {
        send_logs();
        var existing_protocol = $('#webrtc_protocol').html();
        $('#webrtc_protocol').html('Sent');
        setTimeout(function() { $('.webrtc_send_logs').html(existing_protocol);  }, 2000); 
  }); 
}

function send_logs() {
          var from_app = 'Player'; 
          var current_logs = encodeURIComponent($('#console_log').html());
          var current_stats = { protocol: $('#webrtc_protocol').html(), ping_time: $('#webrtc_ping_time').html(), jitter: $('#webrtc_jitter').html(), packets_lost: $('#webrtc_packets_lost').html(), mos: $('#webrtc_mean_opinion_score').html(), duration: $('#connected_time').html(), session_id: session_info['session_id'], browser: $('#user_agent').html() };
          console.log(current_stats); 
          console.log(JSON.stringify(current_stats)); 
          $.ajax({ method: "GET", url: 'https://www.livesquawk.com/webrtc/ajax/notification.php', data: { current_logs:  current_logs, current_stats: JSON.stringify(current_stats), from_app: from_app  }, cache: false, success: function (data){ }});
}



/* LOGGING */
function start_logging_interval() {
  logging_interval = setInterval(function() { new_update_session_info(); },logging_interval_time);  
}

function new_update_session_info() {
    var d = new Date();
    var n = d.getTime();
   session_info['protocol'] = protocol;
   session_info['restarts'] = 0;
   session_info['threshold'] = 0;
   session_info['curr_delay'] =(effective_latency / 1000).toFixed(2);
   session_info['s_l'] = n-session_start_time;
   session_info['webrtc_protocol'] = protocol;
   session_info['ping_time'] = ping_time;
   session_info['jitter'] = average_jitter.toFixed(0); 
   session_info['packet_loss'] = average_packets_lost_last_10.toFixed(2); 
   session_info['effective_latency'] = effective_latency;
   session_info['mean_opinion_score'] = mean_opinion_score;

        if (socket_emits == 0) {     
        //  console.log('webrtc_log_data_full'); 
          //  console.log(session_info['session_id']); 
                    socket.emit('webrtc_log_data_full', {
                            connection_protocol: session_info['protocol'],
                            restarts: session_info['restarts'],
                            threshold: session_info['threshold'],
                            curr_delay: session_info['curr_delay'],
                            s_l: session_info['s_l'],
                            date: n,
                            browser_codename: session_info['browser_codename'],
                            browser_name: session_info['browser_name'],
                            user_agent:  session_info['user_agent'],
                            browser_version: session_info['browser_version'],
                            cookies_enabled: session_info['cookies_enabled'],
                            platform: session_info['platform'],
                            player_version: session_info['player_version'],
                            stream: session_info['stream'],
                            delay_target: 0,
                            op_sys: '',
                            flash_version: '',
                            http_referrer: '',
                            php_session_id: php_session_id,
                            user_email: session_info['session_email'],
                            webrtc_protocol: session_info['webrtc_protocol'],
                            ping_time: session_info['ping_time'],
                            jitter: session_info['jitter'],
                            packet_loss: session_info['packet_loss'],
                            effective_latency: session_info['effective_latency'],
                            mean_opinion_score: session_info['mean_opinion_score'],
                            session_id: session_info['session_id']
                             });
              //    console.log('full_logging');     
            } /* END If log full data */
            else { 
          //    console.log('webrtc_log_data'); 
              //console.log(session_info['session_id']); 
              socket.emit('webrtc_log_data',  { 
                session_id: session_info['session_id'], 
                php_session_id: php_session_id, 
                connection_protocol: session_info['protocol'], 
                restarts: session_info['restarts'], 
                threshold: session_info['threshold'], 
                curr_delay: session_info['curr_delay'], 
                s_l: session_info['s_l'], 
                date: n,
                webrtc_protocol: session_info['webrtc_protocol'],
                ping_time: session_info['ping_time'],
                jitter: session_info['jitter'],
                packet_loss: session_info['packet_loss'],
                effective_latency: session_info['effective_latency'],
                mean_opinion_score: session_info['mean_opinion_score']    
               }); 
              //   console.log('logging');     
             } /* END else log data */
            socket_emits++;
            if (socket_emits == 100) { socket_emits = 0;   }
}


function webrtc_start_log() {
    var d = new Date();
    var n = d.getTime();
    var start_log_data = {};
    session_start_time = n;
    connection_start_time = (n/1000).toFixed(0);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[d.getMonth()];
    var session_start_date = d.getDate() + " " + month + " " + d.getFullYear();
  
    socket.emit('webrtc_start_log',  { 
        username: session_info['session_email'], 
        php_session_id: php_session_id, 
        webrtc_protocol: protocol, 
        session_start_time: (session_start_time/1000).toFixed(0), 
        stream_name: streamInfo.streamName, 
        session_start_date: session_start_date  });     
    clearInterval(connection_interval);
    connection_interval = null;    
    connection_interval = setInterval(function() { update_connected_for(); },connection_interval_time );    
}

function socket_connection_start(server) {
  if (current_server == 0) {
            socket = io.connect('https://ws.livesquawk.com', { path: '/ws'+server+'/socket.io', transports: ['websocket'], upgrade: false, timeout: 10000, reconnectionAttempts: '3'} );
            socket.on('connect', function () { 
                $('#console_log').append(Math.floor(Date.now() / 1000)+" Connected to server "+server+"<br>");
                socket.emit('request_server_assignment');
              
            });
  
  }
  else if (current_server == webrtc_distributor_server) {
      socket = io.connect('https://ws.livesquawk.com', { path: '/ws'+server+'/socket.io', transports: ['websocket'], upgrade: false, timeout: 10000, reconnectionAttempts: '3'} );
        socket.on('connect', function () { 
          socket.emit('join_channel', { publisher_channel: publisher_channel, username: player_partner_name, subscriber_group: '', display_name: player_partner_name, single_sign_on: '' });  
          post_client_server_connection_functions();
        });
    
  }
  current_server = server;  
  
   socket.on('connection_response',function(data) { $('#console_log').append(Math.floor(Date.now() / 1000)+" "+data+"<br>");  });
   socket.on('output',function(data) { $('#console_log').append(Math.floor(Date.now() / 1000)+" "+data+"<br>");  });
   
   socket.on('server_assignment_response',function(data) {
     webrtc_assigned_server = data;
     socket.disconnect();
      $('#console_log').append(Math.floor(Date.now() / 1000)+" Disconnected from distributor<br>");
      $('#console_log').append(Math.floor(Date.now() / 1000)+" Client sent to server "+data+"<br>"); 
      socket_connection_start(webrtc_assigned_server);
   });
   
   socket.on('server_ping',function(data) { }); 
   socket.on('reconnect', function() { $('#console_log').append(Math.floor(Date.now() / 1000)+" Reconnected<br>");  });
   socket.on('disconnect', function () {  $('#console_log').append(Math.floor(Date.now() / 1000)+" Disconnected<br>");  });
   socket.on('client_tweet_in',function(data) { });
   socket.on('new_latest_news',function(data) { });
   socket.on('new note',function(data) { /* write_new_note(data); */ });
   socket.on('reload', function(data) { 
     document.cookie = "reload_restart=true";
     try { }
     catch(err) { console.log(err); }
   });
   socket.on('start_log_response', function(data) { 
    // console.log('start_log_response');
     //console.log(data); 
     session_info['session_id'] = data; 
     start_logging_interval();
     });
  
}




/* VOLUME */
function webrtc_new_volume() {
  var c_value = getCookie();
  if (c_value == 999) {  c_value = 75;  Cookies.set('player_volume',75, { path: '/', sameSite: 'strict', secure: true }); }
  
  if (c_value > 100) {  c_value = 100;   Cookies.set('player_volume',100, { path: '/', sameSite: 'strict', secure: true }); }
   $('.webrtc__volume__progress').width(c_value+"%");
   $('.webrtc__volume__knob').css({ "left": c_value+"%"});
   volume_width = $('.webrtc__volume__inner').innerWidth();
   webrtc_vol_level = (c_value / 100);
   remoteVideo.volume = webrtc_vol_level;
  if (webrtc_vol_level == 0) { 
    remoteVideo.muted = true; 
    is_muted = true; 
   $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
   $('#console_log').append(Math.floor(Date.now() / 1000)+" Muted<br>");
    } 
  else { 
    $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
    remoteVideo.muted = false; 
    is_muted = false; 
    $('#console_log').append(Math.floor(Date.now() / 1000)+" Unmuted<br>");
  
  }
    
   $(document).on("click",".webrtc__volume_mute_icons--active",function(event) {
              pre_muted_volume = webrtc_vol_level;
              remoteVideo.muted = true; 
              $('#console_log').append(Math.floor(Date.now() / 1000)+" Muted by Click of Icon<br>");
              $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
              webrtc_vol_level = 0; 
              $('.webrtc__volume__progress').width((webrtc_vol_level*100)+'%');
              $(".webrtc__volume__knob").css("left",(webrtc_vol_level*100)+'%');
              Cookies.set('player_volume',0, { path: '/', sameSite: 'strict', secure: true });
              if (!is_muted) { soundMeter.stop(); }
              is_muted = true; 
  }); 
  
  $(document).on("click",".webrtc__volume_mute_icons--muted",function(event) {
             remoteVideo.muted = false; 
             $('#console_log').append(Math.floor(Date.now() / 1000)+" Unmuted by Click of Icon<br>");
             $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
             webrtc_vol_level = pre_muted_volume;
             $('.webrtc__volume__progress').width((webrtc_vol_level*100)+'%');
             $(".webrtc__volume__knob").css("left",(webrtc_vol_level*100)+'%');
             Cookies.set('player_volume',webrtc_vol_level*100, { path: '/', sameSite: 'strict', secure: true });
             try { start_soundmeter(); } catch (e) {}
             is_muted = false; 
 }); 
  
   

   $(".webrtc__volume__inner").mouseleave(function() {  $('.webrtc__volume__knob').trigger('dragstop').trigger( 'mouseup');   });
   $( ".webrtc__volume__knob" ).draggable({
        axis: "x",
        containment: ".webrtc__volume__inner",
        scroll: false,
        drag: function() {
                var xPos = $(this).position().left;
                volume_width = $('.webrtc__volume__inner').innerWidth();
            
                webrtc_vol_level = xPos / volume_width;
                 var webrtc_real_vol_level = webrtc_vol_level;
                if (webrtc_real_vol_level > 0.5) {  xPos = xPos + 8;  webrtc_real_vol_level = xPos / volume_width; }
                
              
                if (webrtc_vol_level < 0.05) { webrtc_vol_level = 0;   }
                if (webrtc_real_vol_level < 0.05) { rwebrtc_eal_vol_level = 0;   }
                
                if (webrtc_vol_level > 0.95) { webrtc_vol_level = 1;   }
                if (webrtc_real_vol_level > 0.95) { webrtc_real_vol_level = 1;   }
                
                if (webrtc_vol_level == 0) { 
                            remoteVideo.muted = true; 
                            $('#console_log').append(Math.floor(Date.now() / 1000)+" Muted by drag<br>");
                           $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
                             if (!is_muted) { soundMeter.stop(); }
                           is_muted = true; 
                  } 
                else { 
                              if (is_muted) { 
                                        $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
                                        remoteVideo.muted = false; 
                                        $('#console_log').append(Math.floor(Date.now() / 1000)+" Unmuted by drag<br>");
                                        try { start_soundmeter(); } catch (e) {} 
                                        is_muted = false; 
                            }
                }
                 
                
                $('.webrtc__volume__progress').width((webrtc_vol_level*100)+'%');
                remoteVideo.volume = webrtc_vol_level;
                $('#console_log').append(Math.floor(Date.now() / 1000)+" Volume by drag = "+webrtc_vol_level+"<br>");
        },
        stop: function() {
          
             var xPos = $(this).position().left;
             volume_width = $('.webrtc__volume__inner').innerWidth();
             
             webrtc_vol_level = xPos / volume_width;
            
             var webrtc_real_vol_level = webrtc_vol_level;
             if (webrtc_real_vol_level > 0.5) { 
                 xPos = xPos + 8; 
                 webrtc_real_vol_level = xPos / volume_width;
                  }
             
               if (webrtc_vol_level < 0.05) { webrtc_vol_level = 0;   }
               if (webrtc_real_vol_level < 0.05) { webrtc_real_vol_level = 0;   }
               
               if (webrtc_vol_level == 0) { 
                      remoteVideo.muted = true; 
                      $('#console_log').append(Math.floor(Date.now() / 1000)+" Muted by drag stop<br>");
                      $('.webrtc__volume_mute_icons').addClass('webrtc__volume_mute_icons--muted').removeClass('webrtc__volume_mute_icons--active');
                        if (!is_muted) { soundMeter.stop(); }
                       is_muted = true; 
                 } 
               else { 
                       if (is_muted) { 
                               $('.webrtc__volume_mute_icons').removeClass('webrtc__volume_mute_icons--muted').addClass('webrtc__volume_mute_icons--active');
                               remoteVideo.muted = false; 
                               $('#console_log').append(Math.floor(Date.now() / 1000)+" Unmuted by drag stop<br>");
                               try { start_soundmeter(); } catch (e) {} 
                               is_muted = false; 
                     }
               }
               
             
               if (webrtc_vol_level > 0.95) { webrtc_vol_level = 1;   }
               if (webrtc_real_vol_level > 0.95) { webrtc_real_vol_level = 1;   }
               $('.webrtc__volume__progress').width((webrtc_vol_level*100)+'%');
               remoteVideo.volume = webrtc_vol_level;
               $('#console_log').append(Math.floor(Date.now() / 1000)+" Volume by drag stop = "+webrtc_vol_level+"<br>");
               
               $(this).css("left",(webrtc_vol_level*100)+'%');
              // setCookie(webrtc_real_vol_level*100);
               Cookies.set('player_volume',webrtc_real_vol_level*100, { path: '/', sameSite: 'strict', secure: true });
            
        }
   });
}


function wsConnect(url) {
  if (wsConnection != null) { 
          wsConnection.close(); 
          wsConnection = null;  
   }
  
  
  
	wsConnection = new WebSocket(url);
  wsConnection.binaryType = 'arraybuffer';
        	wsConnection.onopen = function(event) {

              		peerConnection = new RTCPeerConnection(peerConnectionConfig);
              		peerConnection.onicecandidate = gotIceCandidate;
                  peerConnection.oniceconnectionstatechange = onIceConnectionStateChange;
                  
              		
              		if (newAPI) {  peerConnection.ontrack = gotRemoteTrack;  }
              		else { peerConnection.onaddstream = gotRemoteStream; }

              	//	$('#console_log').append("wsURL: "+wsURL+"<br>");
              		if (doGetAvailableStreams) { sendPlayGetAvailableStreams(); }
              		else { sendPlayGetOffer(); }
        		
        	
        		
        	}
	
	function sendPlayGetOffer() {
	//	$('#console_log').append("sendPlayGetOffer: "+JSON.stringify(streamInfo)+"<br>");
		wsConnection.send('{"direction":"play", "command":"getOffer", "streamInfo":'+JSON.stringify(streamInfo)+', "userData":'+JSON.stringify(userData)+'}');
	}

	function sendPlayGetAvailableStreams() {
	//	$('#console_log').append("sendPlayGetAvailableStreams: "+JSON.stringify(streamInfo)+"<br>");
		wsConnection.send('{"direction":"play", "command":"getAvailableStreams", "streamInfo":'+JSON.stringify(streamInfo)+', "userData":'+JSON.stringify(userData)+'}');
	}

	wsConnection.onmessage = function(evt) {
		$('#console_log').append(Math.floor(Date.now() / 1000)+" wsConnection.onmessage: "+evt.data+"<br>");
  //  console.log("wsConnection.onmessage: "+evt.data);
		
		var msgJSON = JSON.parse(evt.data);
		var msgStatus = Number(msgJSON['status']);
    $('#console_log').append(Math.floor(Date.now() / 1000)+" wsConnection.onmessage.status: "+msgStatus+"<br>");
		var msgCommand = msgJSON['command'];
		
  //  console.log(msgCommand); 
    
		if (msgStatus == 514) /* repeater stream not ready */ {
						repeaterRetryCount++;
						if (repeaterRetryCount < 10) { setTimeout(sendGetOffer, 500); }
						else { $("#sdpDataTag").html('Live stream repeater timeout: '+streamName); stopPlay(); }
		}
		else if (msgStatus == 502) {
  //    $("#sdpDataTag").html(msgJSON['statusDescription']);
  
      //stopPlay();
      console.log('502_error');
      clearInterval(stats_interval);
      stats_interval = null;
      webrtc_is_off_air();
      clearInterval(logging_interval);
      logging_interval = null; 
      if (restart_internval == null) {
              restart_internval = setInterval(function() {  
                      try {  
                      //  peerConnection = null; 
                        $('#console_log').append(Math.floor(Date.now() / 1000)+" reconnection attempt<br>");
                        startPlay();
                    } 
                     catch (e) { }
               },restart_check_time);
       }
      
      
    }
    
    
    else if (msgStatus != 200) {
			$("#sdpDataTag").html(msgJSON['statusDescription']);
			stopPlay();
		}
		else {
        if (msgJSON['command'] == 'sendResponse') {  webrtc_start_log(); }
                	$("#sdpDataTag").html("");

									var streamInfoResponse = msgJSON['streamInfo'];
									if (streamInfoResponse !== undefined) { streamInfo.sessionId = streamInfoResponse.sessionId; }

									var sdpData = msgJSON['sdp'];
									if (sdpData !== undefined) {
											//		$('#console_log').append('sdp: '+JSON.stringify(msgJSON['sdp'])+"<br>");
											
                        	peerConnection.setRemoteDescription(new RTCSessionDescription(msgJSON.sdp), function() { peerConnection.createAnswer(gotDescription, errorHandler); }, errorHandler);
									}

									var iceCandidates = msgJSON['iceCandidates'];
									if (iceCandidates !== undefined) {
															for(var index in iceCandidates) {
																				$('#console_log').append(Math.floor(Date.now() / 1000)+" iceCandidates: "+JSON.stringify(iceCandidates[index])+"<br>");
																				peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidates[index]));
															}
                          //    peerConnection.addIceCandidate({candidate:''});
                          //    peerConnection.addIceCandidate(null);
									}
		}
		
		if ('sendResponse'.localeCompare(msgCommand) == 0) {
							if (wsConnection != null) { 
              wsConnection.close(1000); 
              wsConnection = null;  
               }

		}
		// now check for getAvailableResponse command to close the connection 
		if ('getAvailableStreams'.localeCompare(msgCommand) == 0) { stopPlay(); }
	}
	
        	wsConnection.onclose = function() { 
             $('#console_log').append(Math.floor(Date.now() / 1000)+" wsConnection.onclose<br>"); 
           }
	
        	wsConnection.onerror = function(event) {
            $('#console_log').append("<span class='error_red'>You are currently unable to connect to our Websockets server which will prevent you using the player.  <a href='https://www.livesquawk.com/webrtc/player/websockets_error_help.php' target='_blank'>Please refer to these notes on how to diagnose and resolve the issue.</a><span><br>");   
        		$('#console_log').append(Math.floor(Date.now() / 1000)+" wsConnection.onerror: "+JSON.stringify(event,['message', 'arguments', 'type', 'name','data'])+"<br>");
        		$("#sdpDataTag").html('WebSocket connection failed: '+wsURL);
            logging_interval = null; 
        	}
}


function onIceConnectionStateChange() {
  if (peerConnection != null) {
            $('#console_log').append(Math.floor(Date.now() / 1000)+" IceConnectionStateChange: "+peerConnection.iceConnectionState+ "<br>");
               ice_connection_state = peerConnection.iceConnectionState;
            if (peerConnection.iceConnectionState == "failed" ||
                peerConnection.iceConnectionState == "disconnected" ||
                peerConnection.iceConnectionState == "closed") {
            clearInterval(stats_interval);
            stats_interval = null;
            webrtc_is_off_air();
            
                      if (restart_internval == null) {
                              restart_internval = setInterval(function() {  
                                      try {  
                                      //  peerConnection = null; 
                                        $('#console_log').append(Math.floor(Date.now() / 1000)+" reconnection attempt<br>");
                                        startPlay();
                                    } 
                                     catch (e) { }
                               },restart_check_time);
                       }
            
            }
            else if (peerConnection.iceConnectionState == 'connected') {
            
              clearInterval(restart_internval);
              restart_internval = null;
                remoteVideo.play();
          //    if (typeof soundMeter !== 'undefined') { soundMeter.stop();  }
          //    start_soundmeter();
              webrtc_is_on_air();
              //  $('#connect_status').html('Connected').css( {'background-color': 'green', 'border-color': 'white'  }); 
            //    activate_disconnect_button();
            //  my_getStats();
            
            my_getStats();
            }
}
}

function webrtc_is_on_air() { 
  if (webrtc_off_air) { 
          webrtc_off_air = false;  
          $('.webrtc__player__icon').addClass('webrtc__player__icon--on-no-speaking');
          $('.webrtc__player__icon').removeClass('webrtc__player__icon--sim_sound');
          $('.webrtc__player__outer').removeClass('webrtc__player__outer--buffering');
          $('.webrtc__player__outer').addClass('webrtc__player__outer--connected');
          $('.webrtc__player__onair__text').html('ON AIR');
          $('.webrtc__player__middle').addClass('webrtc__player__middle--on-air'); 
          $('#console_log').append(Math.floor(Date.now() / 1000)+" Incoming stream connected<br>"); 
    }
 }
 
function webrtc_is_off_air() { 
            if (!webrtc_off_air || start_off_air == true) {
                  $('#console_log').append(Math.floor(Date.now() / 1000)+" No incoming stream<br>"); 
                  $('.webrtc__player__icon').removeClass('webrtc__player__icon--sim_sound webrtc__player__icon--on-no-speaking');
                  $('.webrtc__player__outer').removeClass('webrtc__player__outer--connected');
                  $('.webrtc__player__outer').removeClass('webrtc__player__outer--buffering');
                  $('.webrtc__player__onair__text').html('OFF AIR');
                  $('.webrtc__player__middle').removeClass('webrtc__player__middle--on-air'); 
                webrtc_off_air = true; 
                start_off_air = false; 
          }
}


function getAvailableStreams() { doGetAvailableStreams=true; startPlay(); }

function startPlay() {
	repeaterRetryCount = 0;
	$('#console_log').append(Math.floor(Date.now() / 1000)+" startPlay: wsURL:"+wsURL+" streamInfo:"+JSON.stringify(streamInfo)+"<br>");
	wsConnect(wsURL);
}

function stopPlay() {
  $('#console_log').append(Math.floor(Date.now() / 1000)+" stopPlay<br>");
  remoteVideo.src = "";
	if (peerConnection != null) { 
        try {  peerConnection.close();  } 
        catch (error){  }
    peerConnection = null; 
  }
	if (wsConnection != null) { wsConnection.close(); wsConnection = null; }
	
	 // this seems like a chrome bug - if set to null it will make HTTP request
	//$('#console_log').append("stopPlay<br>");

}

function gotMessageFromServer(message)  {
					var signal = JSON.parse(message.data);
					if(signal.sdp) {
											if (signal.sdp.type == 'offer') {
											//	$('#console_log').append('sdp:offser<br>');
											//	$('#console_log').append(signal.sdp.sdp+"<br>");
												peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
													peerConnection.createAnswer(gotDescription, errorHandler);
												}, errorHandler);
											}
											else { 
                    //    $('#console_log').append('sdp:not-offer: '+signal.sdp.type+"<br>");
                       }

					}
					else if(signal.ice) {
								$('#console_log').append(Math.floor(Date.now() / 1000)+" ice: "+JSON.stringify(signal.ice)+"<br>");
								peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
					}
}

function gotIceCandidate(event)  {
  //console.log(event);
	if(event.candidate != null)  {}
}

function gotDescription(description)  {
				//	$('#console_log').append('gotDescription<br>');
					peerConnection.setLocalDescription(description, function ()  {
				//		$('#console_log').append('sendAnswer<br>');
						wsConnection.send('{"direction":"play", "command":"sendResponse", "streamInfo":'+JSON.stringify(streamInfo)+', "sdp":'+JSON.stringify(description)+', "userData":'+JSON.stringify(userData)+'}');
					}, function() { $('#console_log').append(Math.floor(Date.now() / 1000)+" set description error<br>")});
}

function gotRemoteTrack(event)  {
//	$('#console_log').append('gotRemoteTrack: kind:'+event.track.kind+' stream:'+JSON.stringify(event.streams[0])+"<br>");
	try{ remoteVideo.srcObject = event.streams[0]; 	 } 
	catch (error){ remoteVideo.src = window.URL.createObjectURL(event.streams[0]); }

}

function gotRemoteStream(event) {
//	$('#console_log').append('gotRemoteStream: '+JSON.stringify(event.stream)+"<br>");
	try{ remoteVideo.srcObject = event.stream; 	} 
	catch (error){ remoteVideo.src = window.URL.createObjectURL(event.stream); }

  
}

function errorHandler(error)  { console.log(error); $('#console_log').append(Math.floor(Date.now() / 1000)+" Error = "+error+"<br>"); }





/* STATS */

function my_getStats() {
  if (ping_interval == null) {
    ping("5ec3b203a6241.streamlock.net", "", function(m){  ping_time = m;   $('#webrtc_ping_time').html(ping_time+"ms");  });
    ping_interval = setInterval(function() {  
         ping("5ec3b203a6241.streamlock.net", "", function(m){  ping_time = m;   $('#webrtc_ping_time').html(ping_time+"ms");  });
   }, ping_time_interval); 
 }
 
 clearInterval(stats_interval);
 stats_interval = null;
	 stats_interval = setInterval(function() { 
    
     if (peerConnection != null) {
      				   try {  peerConnection.getStats(null).then(function(stats) { 
      						 var stats_string = dumpStats_limited(stats); 
                  // var stats_string = dumpStats_full(stats); 
      						 $('#webrtc_stats').html(stats_string); });
      					 } 
      					catch (e) { }
      }
	  },stats_interval_time);
		
		if (!is_muted) { try {  start_soundmeter(); } catch (e) {  } }
		

}


function dumpStats_full(results) {
  var statsString = '';
  results.forEach(function(res) {
    statsString += '<h3>Report type=';
    statsString += res.type;
    statsString += '</h3>\n';
    statsString += 'id ' + res.id + '<br>\n';
    statsString += 'time ' + res.timestamp + '<br>\n';
    Object.keys(res).forEach(function(k) {
      if (k !== 'timestamp' && k !== 'type' && k !== 'id') {
        statsString += k + ': ' + res[k] + '<br>\n';
      }
    });
  });
  return statsString;
}


function dumpStats_audio(results) {
  var statsString = '';
	var last_packet_sent = 0;
	var last_packet_rec = 0;
	
  results.forEach(function(res) {
   if (res.kind == 'audio' ) {
              statsString += '<h3>Report type=';
              statsString += res.type;
              statsString += '</h3>\n';
              statsString += 'id ' + res.id + '<br>\n';
              statsString += 'time ' + res.timestamp + '<br>\n';
              Object.keys(res).forEach(function(k) {
                if (k !== 'timestamp' && k !== 'type' && k !== 'id') {
									if (k == 'lastPacketReceivedTimestamp') {  last_packet_rec = res[k]; }
									if (k == 'lastPacketSentTimestamp') {  last_packet_sent = res[k]; }
									
                  statsString += k + ': ' + res[k] + '<br>\n';
                }
              });
  }	
  });
	
		statsString += "<br><br>"; 
		statsString += "Last Packet Sent:" + last_packet_sent + "<br>\n";
	  statsString += "Last Packet Received:" + last_packet_rec + "<br>\n";
		statsString += "Last Packet Diff:" + (last_packet_rec - last_packet_sent) + "<br>\n";
	
  return statsString;
}



function dumpStats_limited(results) {
  var statsString = '';
  results.forEach(function(res) {
    if ((res.type == 'candidate-pair' && res.selected) || res.type == 'inbound-rtp' || res.type == 'remote-candidate' || res.type == 'track') {
          //    statsString += '<h3>Report type=';
          //    statsString += res.type;
          //    statsString += '</h3>\n';
          //    statsString += 'id ' + res.id + '<br>\n';
            //  statsString += 'time ' + res.timestamp + '<br>\n';
              Object.keys(res).forEach(function(k) {
                if (k !== 'timestamp' && k !== 'type' && k !== 'id') {
                            if (k == 'bytesReceived' || 
                                k == 'lastPacketReceivedTimestamp' || 
                                k == 'bytesSent' || 
                                k == 'currentRoundTripTime' || 
                                k == 'availableOutgoingBitrate' || 
                                k == 'packetsReceived' || 
																k == 'packetsLost' || 
																k == 'jitter' || 
																k == 'ip' || 
																k == 'audioLevel' || 
																k == 'totalSamplesReceived' || 
																k == 'totalSamplesDuration' || 
																k == 'insertedSamplesForDeceleration' || 
																k == 'removedSamplesForAcceleration' || 
		                            k == 'totalAudioEnergy' || 
																k == 'port' || 
																k == 'protocol' || 
                                k == 'retransmittedPacketsSent' ) {
                                        statsString += "<span class='stat_label'>" + k + ": </span>" + res[k] + "<br>\n";
                                      //  statsString += "<span class='stat_label'>" + res.type + ":" + k + ": </span>" + res[k] + "<br>\n";
                              }
                            if (k == 'lastPacketReceivedTimestamp'  ) {
                                   if (res[k] == last_packet_timestamp) { webrtc_is_off_air(); }
                                    else {   webrtc_is_on_air();  }
                                   last_packet_timestamp = res[k];
                            } 
                            if (k == 'protocol') { protocol = res[k]; $('#webrtc_protocol').html(res[k]);  }
                            if (k == 'jitter') { 
                              jitter_last_10.push(res[k] * 1000); 
                              if (jitter_last_10.length > 10) { jitter_last_10.shift(); }
                              average_jitter = average(jitter_last_10);
                              $('#webrtc_jitter').html(average_jitter.toFixed(0) + "ms"); 
                             }
                              if (k == 'packetsReceived' && res.type == 'inbound-rtp' ) { 
                              received_since_last = res[k] - last_packets_received;
                              last_packets_received = res[k];   
                             }
                            if (k == 'packetsLost') {
                              var lost_since_last = res[k] - last_packets_lost;
                                      if (received_since_last > 0 || lost_since_last > 0) {
                                              var lost_percent = (lost_since_last / (received_since_last + lost_since_last)) *100;
                                              packets_lost_last_10.push(lost_percent); 
                                              if (packets_lost_last_10.length > 10) { packets_lost_last_10.shift(); }
                                              average_packets_lost_last_10 = average(packets_lost_last_10);
                                              $('#webrtc_packets_lost').html(average_packets_lost_last_10.toFixed(1)+"%");
                                    }
                            last_packets_lost = res[k];   
                        }
                      
                  
                        /* https://www.pingman.com/kb/article/how-is-mos-calculated-in-pingplotter-pro-50.html# */
                        /* Take the average latency, add jitter, but double the impact to latency then add 10 for protocol latencies */
                          effective_latency = (ping_time + (average_jitter * 2) + 10); 
                        /*  Implement a basic curve - deduct 4 for the R value at 160ms of latency (round trip).  Anything over that gets a much more agressive deduction*/
                          if (effective_latency < 160) { r = 93.2 - (effective_latency / 40);  } else { r = 93.2 - ((effective_latency - 120) / 10); }
                          /* Now, let's deduct 2.5 R values per percentage of packet loss */
                          r = r - (average_packets_lost_last_10 * 2.5);  
                          /* Convert the R into an MOS value.(this is a known formula) */
                          mean_opinion_score = 1 + ((0.035) * r) + ((.000007) * r * (r-60) * (100-r));
                          $('#webrtc_mean_opinion_score').html(mean_opinion_score.toFixed(1));
                          if (mean_opinion_score >= 1) { $('.qos_bar--one .qos_bar_inner').css({ width: "100%"});  }  else { $('.qos_bar--one .qos_bar_inner').css({ width: (mean_opinion_score * 100).toFixed(1)+"%"}); }
                          if (mean_opinion_score >= 2) { $('.qos_bar--two .qos_bar_inner').css({ width: "100%"});   }  else if (mean_opinion_score >= 1) { $('.qos_bar--two .qos_bar_inner').css({ width: ((mean_opinion_score - 1) * 100).toFixed(1)+"%"}); } else {   $('.qos_bar--two .qos_bar_inner').css({ width: "0%"});   }
                          if (mean_opinion_score >= 3) { $('.qos_bar--three .qos_bar_inner').css({ width: "100%"});   }  else if (mean_opinion_score >= 2) { $('.qos_bar--three .qos_bar_inner').css({ width: ((mean_opinion_score - 2) * 100).toFixed(1)+"%"}); } else {   $('.qos_bar--three .qos_bar_inner').css({ width: "0%"});   }
                          if (mean_opinion_score >= 4) { $('.qos_bar--four .qos_bar_inner').css({ width: "100%"});   }  else if (mean_opinion_score >= 3) { $('.qos_bar--four .qos_bar_inner').css({ width: ((mean_opinion_score - 3) * 100).toFixed(1)+"%"}); } else {   $('.qos_bar--four .qos_bar_inner').css({ width: "0%"});   }
                          if (mean_opinion_score >= 5) { $('.qos_bar--five .qos_bar_inner').css({ width: "100%"});   }  else if (mean_opinion_score >= 4) { $('.qos_bar--five .qos_bar_inner').css({ width: ((mean_opinion_score - 4) * 100).toFixed(1)+"%"}); } else {   $('.qos_bar--five .qos_bar_inner').css({ width: "0%"});   }
                          
                          
                              
                }
              });
  }
  });
  return statsString;
}


function average (values) {
    var sumValues = values.reduce(function(sum, value){ return sum + value; }, 0);
    return (sumValues / values.length);
} 
    
function ping(host, port, pong) {
  var started = new Date().getTime();
  var http = new XMLHttpRequest();
  http.open("GET", "https://"+host, true);
  http.onreadystatechange = function() {
          if (http.readyState == 4) {
            var ended = new Date().getTime();
            var milliseconds = ended - started;
            if (pong != null) { pong(milliseconds); }
          }
  };
  try { http.send(null); } 
  catch(exception) { /* this is expected */ }
}


/* END STATS */


/* SOUND METER */


function start_soundmeter() {
//  console.log('start_soundmeter'); 
		var my_stream = remoteVideo.srcObject;
	  try { 
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
		  window.audioContext = new AudioContext();
			const soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
			soundMeter.connectToSource(my_stream, function(e) {
							if (e) { alert(e); return; }
							sound_meter_interval = setInterval(() => {
										var width_pc = soundMeter.instant.toFixed(2) * 100; 
										$('.volume_bar_inner').css({width: width_pc+"%"});
                  
                    if (soundMeter.instant >= silence_level) {  $('.volume_bar_inner').css({ 'background-color': 'green' }); }
                    else { $('.volume_bar_inner').css({ 'background-color': '#f58220' });   }
                  
                  
                    if (soundMeter.instant >= silence_level ) {
                          if (!currently_sound) { 
                            $('.player__icon').addClass('player__icon--sound');
                              currently_sound = true; 
                              //console.log('sound'); 
                             }
                          if (silence_timeout != null) { clearTimeout(silence_timeout); silence_timeout = null; }
                    }
                    if (soundMeter.instant < silence_level && currently_sound && silence_timeout == null ) {
                           silence_timeout = setTimeout(function() {
                              currently_sound = false; 
                              //console.log('sound_off'); 
                                $('.player__icon').removeClass('player__icon--sound');
                           }, silence_time); 
                           
                    }
													
							}, 100);
			  });
	    } catch (e) { alert('Web Audio API not supported.'); }  
}




function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  const that = this;
  this.script.onaudioprocess = function(event) {
    const input = event.inputBuffer.getChannelData(0);
    let i;
    let sum = 0.0;
    let clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);
    that.slow = 0.95 * that.slow + 0.05 * that.instant;
    that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  $('#console_log').append(Math.floor(Date.now() / 1000)+" SoundMeter On<br>");
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') { callback(null); }
  } catch (e) {
        console.error(e);
        if (typeof callback !== 'undefined') { callback(e); }
  }
};

SoundMeter.prototype.stop = function() { 
        $('#console_log').append(Math.floor(Date.now() / 1000)+" SoundMeter Off<br>");
        this.mic.disconnect(); 
        this.script.disconnect(); 
        $('.volume_bar_inner').css({ 'background-color': '#f58220' });
        $('.volume_bar_inner').css({width: "0%"});
        $('.player__icon').removeClass('player__icon--sound');
};

/* END SOUND METER */

