var socket = io.connect('/');
var myName;
var roomName;
var map;
window.onload = function(){
    myName = $('#myName').val();
    roomName = $('#roomName').val();
    btn.onclick = function() {
        var message = $('#message');
        if(message.val().length != 0){
            socket.emit('msg send', myName, message.val());
            $('#message').val('');
        }
    };
    $(function(){
        $('#message').addClear();
    });
    sendLocation();
};
function sendLocation(){
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var latlng = new google.maps.LatLng(latitude, longitude);
        if(map == null) {
            var options = {
                zoom: 16,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById('map'), options);
        }
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=1.5|0|ffffff|11|b|' + myName
        });
        socket.emit('send', myName, latitude, longitude);
        setTimeout("sendLocation()",1000);
    }, function(e) {
        alert('位置情報が取得できません。位置情報送信の設定が正しく行われているかチェックして下さい。');
        console.log(e);
    });
};

socket.on('connected', function(){
    socket.emit('init', roomName);
});

socket.on('receive', function(friendName, latitude, longitude){
    var latlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=1.5|0|ffffff|11|b|' + friendName
        });
});

//サーバーが受け取ったメッセージを返して実行する
socket.on('msg push', function (myName, msg, now) {
    $('#list').prepend($('<tr><td>' + myName + '</td><td>' + now + '</td></tr><tr><td colspan="2">' + msg + '</td></tr>'));
});
