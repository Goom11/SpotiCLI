// Variable Declarations
var sp = getSpotifyApi();
var models = sp.require('$api/models');
var views = sp.require("$api/views");
var stack = new Array();
var stacknum = 0;
var current = 0;
var tabc = "\xA0\xA0\xA0\xA0";
var first_arg;
var song = '';
var list;
var using = 'n';
var output;
var search_term;
var current_player;
var email;
var artist;
var n_album;
var s_name;
var artist_u;
var n_album_u;
var s_name_u;

// Constant Declarations
var SWITCHES = [
    ['-s', '--song SONG_ID', "Plays song with given SONG_ID"],
    ['-l', '--list LIST_ID', "Plays playlist with given LIST_ID"],
    ['-h', '--help', "Shows help section"],
    ['-t', '--time TIME', "Sets time to given time for seeking"],
    ['-e', '--email EMAIL', "Saves log to specified email"]
];
var BASE = "http://spoticli.herokuapp.com/scripts/gracenote.php"

// Parser Setup
var parser = new optparse.OptionParser(SWITCHES), print_summary = true, first_arg;
parser.banner = 'spotiCLI parsing';

parser.on(0, function(value) {
    first_arg = value;
});

// Setup options for different commands
parser.on('song', function(name, song_id) {
    console.log(song_id);
    song = song_id;
    using = 's';
});

parser.on('email', function(name, email_id) {
    email = email_id;
});

parser.on('list', function(name, list_id) {
    list = list_id;
    using = 'l';
});

parser.on('help', function() {
    help();
});

parser.on('time', function(name, time) {
    seek_time = time;
});

//individual functions called by parser
function help() {
    switch(first_arg) {
    case "play":
        output = "[play] plays the given song or playlist";
        break;
    case "find":
        output = "[find] searches spotify for a all songs that match a search term";
        break;
    default:
        output = "[" + first_arg + "] command not found";
    }
}

function play() {
    s_name = "song not found";
    if (using == 's') {
        models.player.playTrack(models.Track.fromURI(song));
        models.Track.fromURI(song).name;
        s_name = models.Track.fromURI(song).name;
    }
    return "Playing";
}

function pause() {
     models.player.playing = false;
}

function resume() {
    models.player.playing = true;
}

function seek() {
    models.player.position = parseInt(seek_time, 10);
}

var x = {};
var y = "";
var z = {};

//more info from gracenote API
function info() {
    if (song != "") {
        s_name = models.Track.fromURI(song).name;
        n_album = models.Track.fromURI(song).album.name;
        artist = models.Track.fromURI(song).artists[0].name;
        artist_u = BASE + "?artist=" + artist;
        n_album_u = artist_u + "&album=" + n_album;
        s_name_u = n_album_u + "&track=" + s_name; //final URL for JSON
        output = "";
        $.ajax({
            type: 'GET',
            url: s_name_u,
            jsonp: "jsonp",
            dataType: 'json', // json since domain is allowed
            success: function (data) {
                z = data;
                x = z[0];
                y += "Artist: " + x.album_artist_name + "</br>";
                y += "Album: " + x.album_title + "</br>";
                y += "Album Year: " + x.album_year + "</br>";
                if (x.artist_origin.length != 0) {
                    y += "Artist Origin";
                    for (i = 0; i < x.artist_origin.length; i++) {
                        y += ": " + x.artist_origin[i].text;
                    }
                    y += "</br>";
                }
                if (x.genre.length != 0) {
                    y += "Genre";
                    for (i = 0; i < x.genre.length; i++) {
                        y += ": " + x.genre[i].text;
                    }
                    y += "</br>";
                }
                if (x.tracks[0].mood.length != 0) {
                    y += "Mood";
                    for (i = 0; i < x.tracks[0].mood.length; i++) {
                        y += ": " + x.tracks[0].mood[i].text;
                    }
                    y += "</br>";
                }
                if (x.artist_era.length != 0) {
                    y += "Era: " + x.artist_era[0].text + "</br>";
                }
                if (x.tracks[0].tempo.length != 0) {
                    y += "Tempo";
                    for (i = 0; i < x.tracks[0].tempo.length; i++) {
                        y += ": " + x.tracks[0].tempo[i].text;
                    }
                    y += "</br>";
                }
                //hack for inserting before prompt since
                //async javascript will return before json is downloaded
                $('#prompt').before(y);
                $("#console").scrollTop($("#console")[0].scrollHeight);
            }
        });
        //return empty string to prevent printing 'undefined'
        return "";

    } else {
        return "No song currently playing";
    }
}

function album() {
    if (song != "") {
        output = models.Track.fromURI(song).album.name;
    } else {
        output = "No song currently playing";
    }
}

function find() {
    var search = new models.Search(search_term);
    search.localResults = models.LOCALSEARCHRESULTS.APPEND;
    var out = "</br>";
    search.observe(models.EVENT.CHANGE, function() {
        var results = search.tracks;
        for (var i=0; i<results.length; i++){
            var j = i + 1;
            out += j.toFixed() + " " + results[i].name + " : " + results[i].uri + "</br>";
        }
        //hack for inserting async text block
        $('#prompt').before(out);
        $("#console").scrollTop($("#console")[0].scrollHeight);
    });

    search.appendNext();
    $("#console").scrollTop($("#console")[0].scrollHeight);
    return "";
}

//parser for input
function parse_input(input) {
    output = "";
    args = input.split(" ");
    parser.parse(args);
    if (output == "") {
        switch(first_arg) {
            case 'play':
                output = play();
            break;
            case 'find':
                search_term = args[1];
                output = find();
            break;
            case 'pause':
                pause();
                output = "";
                break;
            case 'troll':
                window.open("http://spoticli.herokuapp.com/index.php");
            break;
            case 'save':
                $.ajax({
                    type: 'GET',
                    url: 'http://spoticli.herokuapp.com/scripts/save.php',
                    jsonp: "jsonp",
                    data: {
                            'email': email,
                            'message': document.getElementById('consolation').innerHTML,
                        },
                    dataType: 'json', // json since domain is allowed
                    success: function (data) {
                        
                        //hack for inserting before prompt since
                        //async javascript will return before json is downloaded
                        $('#prompt').before(data);
                        $("#console").scrollTop($("#console")[0].scrollHeight);
                    }
                });
                /*
                var emailURL = 'http://spoticli.herokuapp.com/scripts/save.php?'
                emailURL += 'email=' + email;
                emailURL += '&message=' + document.getElementById('consolation').innerHTML;
                var xmlHttp = null;
                xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "GET", emailURL, false );
                xmlHttp.send( null );
                console.log(emailURL);
                return xmlHttp.responseText;
                */
                return "";
            break;
            case 'resume':
              resume();
            break;
            case 'seek':
              seek();
            break;
            case 'album':
              album();
            break;
            case 'info':
              return info();
            break;
            default:
                help();
        }
    }
    first_arg = ""
    console.log(output);
    return output;
}

// Up-Down Command History (Daniel Duan)
$("#cline").keyup(function(event){
    if(event.keyCode == 13){
        updateTerminal();
    } else if(event.keyCode == 38){ //up arrow
    	if (current > 0) {
    		current--;
    		document.getElementById('cline').value = stack[current];
    	}
    } else if (event.keyCode == 40){
    	if (current < stacknum) {
    		current++;
    		document.getElementById('cline').value = stack[current];
    	}
    }
});


$("#cline").focus();
$(document).click(function() { $("#cline").focus() });

function initial() { var prompt = "[user@spotify.com ~]$ <input autofocus='autofocus' id='cline' type='text' size='58' name='cline' maxlength='100'></br>";
	$('#prompt').innerHTML = prompt;
	var cli = document.getElementById('cline');
	cli.value = "";
}

initial();

//called when enter is pressed
function updateTerminal()
{
	var cli = document.getElementById('cline');
	stack[stacknum] = cli.value;
	stack[stacknum+1] = "";
	current = stacknum;
	stacknum++;
	output = parse_input(cli.value);
	$('#prompt').before('['+'user'+'@spotify.com ~]$ ' + cli.value + '</br>');
	if (output != "") {
		output += '</br>';
	}
	$('#prompt').before(output);
	cli.value = "";
	var prompt = "["+"user"+"@spotify.com ~]$ <input autofocus='autofocus' id='cline' type='text' size='58' name='cline' maxlength='100'></br>";
	$('#prompt').innerHTML = prompt;
	$("#console").scrollTop($("#console")[0].scrollHeight);
}

//simulate hover of buttons in mac for the three navigation dots
if (document.images) {
    img1 = new Image();
    img1.src = "/img/dotshover.png";
}
