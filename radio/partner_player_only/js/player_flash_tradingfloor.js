var player_version_no = "u5.0";
var sp_id = '80';
var fvmajor_v = 0; var fvmajor_r = 0; var fvminor_v = 0; var fvminor_r = 0; var fv_full = '';
var volume_width = 0;
var session_info = {};
var ra = ''; var rn = ''; var r_num = 0; var lag = 0; var thres = 0;
var logging_timeout;
var logging_interval = 90000;

var ping_img_cycle_time = 600000;
var session_start_time;
var session_id = '';
var prompt = '';
var protocol = '';
var flashMovie;
var path_to_swf = "varia/universal_v6.1.swf";
var socket_emits = 0;

var http_referrer = '';
var user_email = '';

var on_air = true;
var off_air = true;
var on_squawk = true;
var on_net = true;
var fcms_acces = true;
var ia_access = true;
var send_logs = false;



var min_activity_level = 5;
var silence_timout = 2000;

var currently_sound = false; 


function socket_io_loaded() {
    //      socket_connection_start(distributor_server);
          var cookie_value = getCookie();
          if (cookie_value == 999) { 
            Cookies.set('player_volume',initial_volume, { path: '/', sameSite: 'strict', secure: true });
          //  setCookie(initial_volume);
           }
          set_static_session_info();
          start_log();
          $('#player_body').hide();



          if (typeof  open_link !== 'undefined' && $.isFunction( open_link)) { open_link(); }
          if (typeof  close_link !== 'undefined' && $.isFunction( close_link)) {close_link(); }

          ping_img();

          if ($('#channel').html() == 'Player Channel: London Pip') {  player_version_no = 'u5.1'; path_to_swf = "varia/universal_v5_1.swf";   }

          load_player();
          $('#player_version').html(player_version_no);

          if (typeof Cookies.get('popup_type') !== "undefined" && typeof Cookies.get('popup_restart') !== "undefined" ) {
            if (Cookies.get('popup_type') == 'flash' && Cookies.get('popup_restart') == 'true') { 
                        $('.header__player__strip--choice').hide(); 
                        $('.player__outer').show(); 
                        load_player();
                //       check_boot();
                  //     $('#player_version').html(player_version_no);
                       Cookies.remove('popup_restart');
                      
               }
        }



}


function socket_connection_start(server) { 
//  console.log('socket_connection_start'); 
          
          socket = io.connect('https://ws.livesquawk.com', { path: '/ws'+server+'/socket.io', transports: ['websocket'], upgrade: false, timeout: 10000, reconnectionAttempts: '3'} );
          current_server = server;  
          socket.on('connect', function () { 
              $('.output').append('Connected to server '+current_server+'<br>');
              if (current_server == distributor_server) { socket.emit('request_server_assignment'); }
              else {
              socket.emit('join_channel', {publisher_channel: publisher_channel, username: 'Convergent Trading', subscriber_group: '', display_name: 'Convergent Trading', single_sign_on: '' });  
              }
        
           });
           
           socket.on('connection_response',function(data) {
               $('.output').append(data+"<br>"); 
           });
           
           socket.on('output',function(data) {
               $('.output').append(data+"<br>"); 
              
           });
           
           socket.on('start_log_response', function(data) { 
                  console.log('start_log_response');
                  console.log(data); 
                  session_info['session_id'] = data; 
                  start_logging_interval();
          });
           
           socket.on('server_assignment_response',function(data) {
             assigned_server = data;
             socket.disconnect();
              $('.output').append('Disconnected from distributor<br>');
              $('.output').append('Client sent to server '+data+'<br>'); 
              socket_connection_start(assigned_server);
            //  console.log('assigned'+assigned_server); 
           });
           
           socket.on('server_ping',function(data) { /*  $('.output').append('Ping from server '+data+'<br>');  */ }); 
           socket.on('reconnect', function() { $('.output').append('Reconnected<br>');  });
           socket.on('disconnect', function () { $('.output').append('Disconnected<br>');  });
           socket.on('client_tweet_in',function(data) { /* write_tweet(data); */ });
           socket.on('new_latest_news',function(data) { /* write_latest_news(data); */ });
           socket.on('new note',function(data) { /* write_new_note(data); */ });
           
           socket.on('reload', function(data) { 
             Cookies.set('popup_restart','true', { path: '/', sameSite: 'strict', secure: true});    
             location.reload(true); 
           });
           
           
           
           
}

function start_logging_interval() { console.log('shouldnt run'); }


function new_volume() {
  var c_value = getCookie();
  if (c_value > 100) {  c_value = 100;  
    
  //  setCookie(100); 
      Cookies.set('player_volume',100, { path: '/', sameSite: 'strict', secure: true });
   }

   $('.volume__progress').width(c_value+"%");
   $('.volume__knob').css({ "left": c_value+"%"});
   volume_width = $('.volume__inner').innerWidth();
   

   $(".volume__inner").mouseleave(function() {  $('.volume__knob').trigger('dragstop').trigger( 'mouseup');   });
   $( ".volume__knob" ).draggable({
        axis: "x",
        containment: ".volume__inner",
        scroll: false,
        drag: function() {
                var xPos = $(this).position().left;
                
                var vol_level = xPos / volume_width;
                   var real_vol_level = vol_level;
                if (real_vol_level > 0.5) { 
                    xPos = xPos + 8; 
                    real_vol_level = xPos / volume_width;
                
                     }
                
              
                if (vol_level < 0.05) { vol_level = 0;   }
                if (real_vol_level < 0.05) { real_vol_level = 0;   }
                
                if (vol_level > 0.95) { vol_level = 1;   }
                if (real_vol_level > 0.95) { real_vol_level = 1;   }
                
                $('.volume__progress').width((vol_level*100)+'%');
                flashMovie.change_volume(real_vol_level);
            //    console.log(real_vol_level);

        },
        stop: function() {
          
             var xPos = $(this).position().left;
             var vol_level = xPos / volume_width;
             var real_vol_level = vol_level;
             if (real_vol_level > 0.5) { 
                 xPos = xPos + 8; 
                 real_vol_level = xPos / volume_width;
                  }
             
               if (vol_level < 0.05) { vol_level = 0;   }
               if (real_vol_level < 0.05) { real_vol_level = 0;   }
             
               if (vol_level > 0.95) { vol_level = 1;   }
               if (real_vol_level > 0.95) { real_vol_level = 1;   }
             $('.volume__progress').width((vol_level*100)+'%');
               flashMovie.change_volume(real_vol_level);
            //   console.log(real_vol_level);
             $(this).css("left",(vol_level*100)+'%');
          //   setCookie(real_vol_level*100);
               Cookies.set('player_volume',real_vol_level*100, { path: '/', sameSite: 'strict', secure: true });
            
        }
   });
}



function from_flash_flash_version(fvmajorv, fvmajorr, fvminor_v, fvminor_r,op_sys) {
    fvmajor_v = fvmajorv; fvmajor_r = fvmajorr; fvminor_v = fvminor_v; fvminor_r = fvminor_r;
    fv_full = fvmajor_v+"."+fvmajor_r+"."+fvminor_v+"."+fvminor_r;
    $('#flash_version').html("Flash: v"+fvmajor_v+"."+fvmajor_r);
    session_info['flash_version'] = fv_full;
    session_info['op_sys'] = op_sys;
}

function from_flash_ra() {  ra = "RA"; $('#ra').html("RA"); }
function from_flash_clear_ra() {  ra = ""; $('#ra').html(""); }
function from_flash_r_num(new_r_num) { r_num = new_r_num; $('#r_num').html("R"+new_r_num); }
function from_flash_rs() { ra = "RS"; rn = "RS"; $('#ra').html("RS"); $('#rn').html("RS"); }
function from_flash_rn() { rn = "RN"; $('#rn').html("RN"); }
function from_flash_clear_rn() { rn = ""; $('#rn').html(""); }
function from_flash_clear_rf() { rf = "RF"; rn = "RF"; $('#ra').html("RF"); $('#rn').html("RF"); }
function from_flash_lag(new_lag) {
  
     if (new_lag == 0) { new_lag = 0.05;   }
    lag = new_lag;
    $('#lag').html(new_lag.toFixed(2)+" secs");
      }
function from_flash_ac() { ra = "AC"; rn = "AC"; $('#ra').html("AC");  $('#rn').html("AC");  }
function from_flash_thres(new_thres) { thres = Number(new_thres).toFixed(2); $('#thres').html(new_thres.toFixed(2));  }
function from_flash_prompt(new_prompt) { promt = new_prompt; $('#prompt').html(new_prompt);  }
function from_flash_protocol(new_protocol) { protocol = new_protocol;     }
function from_flash_session_start(new_session_start) { session_start_time = new_session_start;   }
function from_flash_min_flash_warning() {  $('#min_flash_warning').html("Player requires Flash Player "+min_flash+"<br><a href='http://get.adobe.com/flashplayer/' target='_blank'><u>Download latest version</u></a>"); }

function get_min_activity_level() { return min_activity_level; }
function get_silence_timeout() { return silence_timout; }

function start_is_sound() { 
  $('.player__icon').addClass('player__icon--sound');
  console.log('start_is_sound');
  currently_sound = true; 

 }
function stop_is_sound() { 
  $('.player__icon').removeClass('player__icon--sound');
  console.log('stop_is_sound');
  currently_sound = false; 
 }

function imagesLoaded() { if (!on_net && !ia_access) { 
  on_net = true; 
  ping_ia_img(); 
  document.cookie = "reload_restart=true";
  location.reload(true); 
}}
function imagesFailed() {  if (on_net) {  on_net = false; ping_ia_img();  }  }
function ia_imagesFailed() {   ia_access = false; }
function ia_imagesLoaded() {   ia_access = true;  }
function ping_ia_img() {
            var ia_img = new Image();
            var ia_sess = new Date();
            var ia_nocache = ia_sess.getMinutes()+ia_sess.getHours()+ia_sess.getDate()+ia_sess.getMonth()+ia_sess.getFullYear();
            $(ia_img)
                .on('load',function () { ia_imagesLoaded(); })
                .on('error',function () { ia_imagesFailed(); })
                .attr('src', 'https://www.insightfulapplications.co.uk/ping_dot.gif?time='+ia_nocache);
    }

function is_on_air() { 
  if (off_air) { 
          off_air = false;  
          $('.player__icon').addClass('player__icon--on-no-speaking');
          $('.player__icon').removeClass('player__icon--sim_sound');
          $('.player__outer').removeClass('player__outer--buffering');
          $('.player__outer').addClass('player__outer--connected');
          $('.player__onair__text').html('ON AIR');
    }
 }
function is_off_air() { 
  console.log('is_off_air');
    $('.player__icon').removeClass('player__icon--sim_sound player__icon--on-no-speaking');
    $('.player__outer').removeClass('player__outer--connected');
    $('.player__outer').removeClass('player__outer--buffering');
    $('.player__onair__text').html('OFF AIR');
  off_air = true; 
}

function ping_img() {
        var img = new Image();
        var pause_time = ping_img_cycle_time;
        var sess = new Date();
        var nocache = sess.getMinutes()+sess.getHours()+sess.getDate()+sess.getMonth()+sess.getFullYear();
        $(img)
            .on('load',function () { imagesLoaded(); })
            .on('error',function () { imagesFailed(); })
            .attr('src', 'varia/ping_dot.gif?time='+nocache);
            setTimeout( function(){ ping_img(); },pause_time);
 }


function get_s_name() { return s_name; }
function get_buffering_text() { return buffering_text;}
function get_server_ip() { return s_id; }
function get_server_port() { return sp_id;}
function get_onair_text() { return onair_text;  }
function get_min_flash() { return min_flash;}
function get_offair_text() { return offair_text;    }
function get_qos_values() { return qos;  }
function get_feed_type() { return feed_type; }
function get_lines() { return lines;    }
function get_off_air_lines() { return off_air_lines; }



function referer_check_boot() {
        var referer = getParameterByName('referer');
        if (referer != 'false' && referer.indexOf("www.livesquawk.com") == -1) {
            var sess = new Date(); var nocache = sess.getTime();
            $.ajax({ url: "https://www.livesquawk.com/player/ajax/referer_boot.php?referer="+referer+"&time="+nocache, timeout: 3000, async: true,  cache: false, success: function(data){
            if (data == 'boot' ) { location.reload(true); }

            else {  setTimeout( "referer_check_boot()" , boot_cycle_time );  }
            } });
        }
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    if (match) { return match && decodeURIComponent(match[1].replace(/\+/g, ' ')); } else { return 'false'; }
}



function start_log() {
  console.log('start_log'); 
    var d = new Date();
    var n = d.getTime();
    var start_log_data = {};
    session_start_time = n; 
    start_log_data['player_channel'] = player_channel;
    start_log_data['session_start_time'] = session_start_time;
    start_log_data['stream_name'] = s_name;
    start_log_data['player_channel'] = player_channel;
    if (typeof sess_id != 'undefined') { start_log_data['sess_id'] = sess_id;  }
    var data_to_send = JSON.stringify( start_log_data );
    $.ajax({ url: "https://www.livesquawk.com/player/ajax/start_log.php",  data: { data: data_to_send }, async: true,   cache: false }).done(function( data ) {
        var json = $.parseJSON(data);
        session_info['session_id'] = json.session_id;
        session_info['session_email'] = json.session_email;
        console.log(session_info['session_id']); 
        new_update_session_info();
    });
}

function new_update_session_info() {
    var d = new Date();
    var n = d.getTime();
    session_info['protocol'] = protocol;
    session_info['restarts'] = r_num;
    session_info['threshold'] = thres;
    session_info['curr_delay'] = lag;
    session_info['stream'] = s_name;
    session_info['remote_ip'] = '';  

    session_info['s_l'] = n-session_start_time;
    if (socket.connected) {
        if (socket_emits == 0) {
                    console.log('log_data_full'); 
                    socket.emit('log_data_full', {
                            session_id: session_info['session_id'],
                            protocol: protocol,
                            restarts: r_num,
                            threshold: thres,
                            curr_delay: lag,
                            s_l: n-session_start_time,
                            date: n,
                            browser_codename: session_info['browser_codename'],
                            browser_name: session_info['browser_name'],
                            user_agent:  session_info['user_agent'],
                            browser_version: session_info['browser_version'],
                            cookies_enabled: session_info['cookies_enabled'],
                            platform: session_info['platform'],
                            player_version: session_info['player_version'],
                            stream: atob(session_info['stream']),
                            delay_target: session_info['delay_target'],
                            op_sys: session_info['op_sys'],
                            flash_version: session_info['flash_version'],
                            http_referrer: http_referrer,
                            php_session_id: php_session_id,
                            user_email: session_info['session_email']
                             });
                      
            }
            else {
              console.log('log_data'); 
            socket.emit('log_data',  { 
                session_id: session_info['session_id'], 
                php_session_id: php_session_id, 
                protocol: protocol, 
                restarts: r_num, 
                threshold: thres, 
                curr_delay: lag, 
                s_l: n-session_start_time, 
                date: n }); }
            socket_emits++;
            var hours = (n-session_start_time) / 3600000;
            var ra_html = $('#ra').html();
      //      console.log('logging'); 
            if ((r_num > 30 || hours > 12) && !currently_sound ) {
        //      document.cookie = "reload_restart=true";
            //   location.reload(true); 
    //      console.log('here');     
            
               try { 
                 socket_emits = 0;
                 flashMovie.reset_threshold();
                  set_static_session_info();
                  qos_array = qos.split(':');
                  thres = Number(qos_array[1]).toFixed(2); 
                  r_num = 0; 
                 start_log();
                 
                }
               catch(err) { console.log(err); }
            }
            
            
            if (socket_emits == 100) { socket_emits = 0;   }
   }
   else {
    
       var data_to_send = JSON.stringify( session_info );
       $.ajax({ url: "https://www.livesquawk.com/player/ajax/update_log_new.php", data: { data: data_to_send }, cache: false, async: true, timeout: 1000  }).done(function( result ) {  });
   }

    }


function load_player() {
                    var flashvars = {};
                    var params = {  wmode:"transparent", allowScriptAccess:"always" };
                    var attributes = {};
                    attributes.id = "player";
                    var flash_object = '<object id="player" type="application/x-shockwave-flash" data="'+path_to_swf+'"><param name="movie" value="'+path_to_swf+'"/><param name="allowscriptaccess" value="always"/><param name="wmode" value="transparent"/><param name=FlashVars value="channel_suffix=&slot=one" /></object>';
                    $('#player').replaceWith(flash_object).promise().done(function() {  load_callback(); });
}

function load_callback() {
  
    $('.player__outer').addClass('player__outer--buffering'); 
    $('.player__onair__text').html('LOADING');
    flashMovie = getFlashMovieObject("player");

    new_update_session_info();
    clearInterval(logging_timeout);
    logging_timeout = setInterval(new_update_session_info, logging_interval);
    new_volume(); 

 }
function getFlashMovieObject(movieName){
    if (window.document[movieName]){ return window.document[movieName]; }
    if (navigator.appName.indexOf("Microsoft Internet") == -1){ if (document.embeds && document.embeds[movieName])  return document.embeds[movieName]; }
    else { return document.getElementById(movieName);  }
    //return document.getElementById(movieName);
}


function console_log(log_text) { /*  console.log("from flash: "+log_text); */ }
