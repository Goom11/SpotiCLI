<html>
<head>
<script src="http://static.opentok.com/webrtc/v2.0/js/TB.min.js" ></script>
<meta http-equiv="X-UA-Compatible" content="chrome=1">
</head>
<body>
<script>
var apiKey = 33044342;
var token = "T1==cGFydG5lcl9pZD0zMzA0NDM0MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz0xMDFlMTY2ZTkwMjVhNGQ4ZjhiMjEzMzEzOTIxNmQ2M2IwNjIyOTYwOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDR6TXpBME5ETTBNbjR4TWpjdU1DNHdMakYtVTNWdUlFcDFiQ0F4TkNBeE5Eb3dOam96TWlCUVJGUWdNakF4TTM0d0xqWXpNekE0T1RGLSZjcmVhdGVfdGltZT0xMzczODM2MDI0Jm5vbmNlPTAuNzg4OTc3NDMxMDQyMTMyNSZleHBpcmVfdGltZT0xMzczOTIyNDI1JmNvbm5lY3Rpb25fZGF0YT0=";
var session = TB.initSession("2_MX4zMzA0NDM0Mn4xMjcuMC4wLjF-U3VuIEp1bCAxNCAxNDowNjozMiBQRFQgMjAxM34wLjYzMzA4OTF-");

function sessionConnectedHandler (event) {

     subscribeToStreams(event.streams);

     session.publish();

}

function subscribeToStreams(streams) {

    for (var i = 0; i < streams.length; i++) {

        var stream = streams[i];

        if (stream.connection.connectionId != session.connection.connectionId) {

            session.subscribe(stream);

        }

    }

}

function streamCreatedHandler(event) {

    subscribeToStreams(event.streams);

}

session.addEventListener("sessionConnected", sessionConnectedHandler);

session.addEventListener("streamCreated", streamCreatedHandler);

session.connect(apiKey, token);

</script>

</body>

</html>