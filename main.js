const track = document.querySelector('#trackname');
var localTitle = localStorage.getItem('playlistTitle');
const playlistDefaultTitle = '<i class="fas fa-edit"></i>' + localTitle != null && localTitle != "null" ? localTitle : 'Add a name to your playlist';
//Get localStorage playlist to the site
// Listener on search input to enable keypress validation
track.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getTrackList();
    }
});

function getTrackList() {
    search(track);
}

// Retrieve and display search results from deezer API
const search = function getTrackListFromDeezer(track) {
    fetch(`https://api.deezer.com/search?q=${track.value}&order=RANKING&limit=10`)
    .then(function(response){
        return response.json();
    })
    .then(function(list) {
        let trackList = "";
        if(list.data.length > 0)
        { 
            document.querySelector('.tracklist').innerHTML = '';
            trackList += `<div class="tracklist-content"><span class="results-text reset-search"><i class="far fa-times-circle"></i>Search : "${track.value}"</span><ul class="search-results">`;
            trackList += '<li class="search-header"><div class="track-cover"></div><span class="track-title">TITLE</span><span class="track-artist">ARTIST</span><span class="track-duration">TIME</span></li>';
           
            list.data.forEach(element => {
                let duration = secToMin(element.duration);
                trackList += `<li class="search-track li-search" data-id="${element.id}">
                <img class="track-cover" src="${element.album.cover_small}">
                <span class="track-title">${element.title}</span>
                <span class="track-artist">${element.artist.name}</span>
                <span class="track-duration">${duration}</span>
                <audio class="track-player" controls="controls">
                <source src="${element.preview}" type="audio/mp3" />
                Votre navigateur n'est pas compatible
                </audio>
                <button class="validate" onclick="addToPlaylist(${element.id})";><i class="fas fa-plus"></i></button>
            </li>`;
            }, trackList);

            trackList += '</ul></div>';
            document.querySelector('.tracklist').innerHTML = trackList;

            let reset = document.querySelector('.reset-search');
            reset.addEventListener("click", function() {
                document.querySelector('.tracklist').innerHTML = '';
            });

        }
        else
            swal({
                title: "Damn !",
                text: `Can't find anything about "${track.value}"...`,
                icon: "error",
                button: "Alright, let's try something else!",
            });
        
        track.value = "";
        track.blur();
    });
}

const secToMin = function convertSecondesToMinutes(duration) {
    let minutes = Math.trunc(duration / 60);
    let secondes = duration % 60;
    let html = `${digit(minutes)}:${digit(secondes)}`;

    return html;
}

const digit = function countDigit(number) {
    let digit = number.toString().length === 1 ? "0" + number : number;

    return digit;
}

const startupPlaylist = function localStorageToPlaylist() {
    var playlist = JSON.parse(localStorage.getItem('deezerPlaylist'));
    if(document.querySelector('.playlist').innerHTML.length == 0) {
        let html = `<div class="playlist-content"><span class="playlist-title" onclick="editTitle();">${playlistDefaultTitle}</span>
        <span class="delete-playlist" onclick="dropPlaylist();"><span class="delete-playlist--text">Drop playlist</span>
        <i class="fas fa-times-circle fa-2x"></i></span>
        <ul class="musicList"></ul><a href="#" class="export">Export</a></div>`;

        document.querySelector('.playlist').innerHTML = html;
        trackListHeader = `<li class="search-header"><div class="track-cover"></div><span class="track-title">TITLE</span>
        <span class="track-artist">ARTIST</span><span class="track-duration">TIME</span></li>`;

        document.querySelector('.musicList').innerHTML = trackListHeader;
    }
    playlist.forEach(track => {
        var liNumber = document.querySelector('.musicList').querySelectorAll('li').length + 1;
        var html = `<li data-id="${track.id}" class="search-track li-playlist">
        <img class="track-cover" src="${track.imageLink}">
        <!--<span class="track-number">${liNumber}</span>-->
        <span class="track-title">${track.track}</span>
        <span class="track-artist">${track.artist}</span>
        <span class="track-duration">${track.duration}</span>
        <audio class="track-player" controls="controls">
        <source src="${track.previewLink}" type="audio/mp3" />
        Votre navigateur n'est pas compatible
        </audio>
        <!--<span class="playButton" onclick="playThisMusic">Play</span>-->
        <button class="delete" onclick="removeFromPlaylist(${track.id})";><i class="fas fa-trash-alt"></i></button>
        </li>`;
        
        //évite les doublons
        if(document.querySelector('.musicList').querySelector('li[data-id="'+ track.id+'"]') == null) {
            document.querySelector('.musicList').innerHTML += html;
            //debugger;
            //console.log(tracks);
        }
    });
}
if(localStorage.getItem('deezerPlaylist') != null && localStorage.getItem('deezerPlaylist').length > 0) {
    startupPlaylist();
}


const addToPlaylist = function addTrackToThePlaylist(trackId) {
    //debugger;
    var tracks = [];
    if(localStorage.getItem('deezerPlaylist') != null && localStorage.getItem('deezerPlaylist').length > 0) {
        var storage = JSON.parse(localStorage.getItem('deezerPlaylist'));
        tracks = tracks.concat(storage);
        //debugger;
    }
    if(document.querySelector('.playlist').innerHTML.length == 0) {
        let html = `<div class="playlist-content"><span class="playlist-title" onclick="editTitle();">${playlistDefaultTitle}</span><span class="delete-playlist" onclick="dropPlaylist();"><span class="delete-playlist--text">Drop playlist</span><i class="fas fa-times-circle fa-2x"></i></span>
        <ul class="musicList"></ul><a href="#" class="export">Export</a></div>`;
        document.querySelector('.playlist').innerHTML = html;
        trackListHeader = '<li class="search-header"><div class="track-cover"></div><span class="track-title">TITLE</span><span class="track-artist">ARTIST</span><span class="track-duration">TIME</span></li>';
        document.querySelector('.musicList').innerHTML = trackListHeader;
    }
    //récupérer les champs de la chanson correspondant
    var li = document.querySelector('.search-results').querySelector('li[data-id="'+ trackId+'"');
    var image = li.querySelector('.track-cover').getAttribute('src');
    var title = li.querySelector('.track-title').innerHTML;
    var artist = li.querySelector('.track-artist').innerHTML;
    var duration = li.querySelector('.track-duration').innerHTML;
    var preview = li.querySelector('.track-player > source').getAttribute('src');
    var liNumber = document.querySelector('.musicList').querySelectorAll('li').length + 1;
    var html = `<li data-id="${trackId}" class="search-track li-playlist">
    <img class="track-cover" src="${image}">
    <!--<span class="track-number">${liNumber}</span>-->
    <span class="track-title">${title}</span>
    <span class="track-artist">${artist}</span>
    <span class="track-duration">${duration}</span>
    <audio class="track-player" controls="controls">
    <source src="${preview}" type="audio/mp3" />
    Votre navigateur n'est pas compatible
    </audio>
    <!--<span class="playButton" onclick="playThisMusic">Play</span>-->
    <button class="delete" onclick="removeFromPlaylist(${trackId})";><i class="fas fa-trash-alt"></i></button>
    </li>`;
    
    //évite les doublons
    if(document.querySelector('.musicList').querySelector('li[data-id="'+ trackId+'"]') == null) {
        document.querySelector('.musicList').innerHTML += html;
        var lidata = document.querySelector('.musicList').querySelector('li[data-id="'+ trackId+'"]');
        var trackAdd = {
            "id": trackId,
            "imageLink": image,
            "track": title,
            "artist": artist,
            "duration": duration,
            "previewLink": preview};
        tracks.push(trackAdd);
        //debugger;
        //console.log(tracks);
        localStorage.setItem('deezerPlaylist', JSON.stringify(tracks));        
    }
}

const editTitle = function editPlaylistTitle() {
    swal("What cool name for your playlist ?", {
        content: "input"
      })
      .then((value) => {
          if(value !== "") {
            document.querySelector('.playlist-title').innerHTML = `<i class="fas fa-edit"></i>${value}`;
            localStorage.setItem('playlistTitle',value);
          } else {
            document.querySelector('.playlist-title').innerHTML = playlistDefaultTitle;
          }
      });
}

// Delete the current playlist
const dropPlaylist = function deleteCurrentPlaylist() {
    swal("You sure you want to drop this playlist ?", {
        buttons: {
          no: {
              text: "Hell no !",
              className: "cancel",
              value: false
            },
          confirm: {
            text: "For sure.",
            className: "accept",
            value: true
          }
      }}).then((value) => {
          switch(value) {
              case false:
                break;

              case true:
                document.querySelector('.playlist').innerHTML = "";
                localStorage.removeItem('deezerPlaylist');
                break;

          }
      });   
}

const playThisMusic = function PlayTrackFromPlaylist(track) {
    //envoyer la musique choisie dans le player
}

const getPlaylist = function getTracksInPlaylist() {
    
}

const removeFromPlaylist = function removeTrackFromPlaylist(trackId) {
    swal("This track is dope, you sure ?", {
        buttons: {
          no: {
              text: "No",
              className: "cancel",
              value: false
            },
          confirm: {
            text: "Yiss !",
            className: "accept",
            value: true
          }
      }}).then((value) => {
          switch(value) {
              case false:
                break;

              case true:
                //debugger;
                //la suppression des éléments dans le localStorage a encore quelques bugs
                var tracks = [];
                var storage = JSON.parse(localStorage.getItem('deezerPlaylist'));
                tracks = tracks.concat(storage);
                var i = -1; var ii = i;
                tracks.forEach(trackToRemove => {
                    ii++;
                    if(trackToRemove.id === trackId) {
                        i = ii;
                    }

                });
                //debugger;
                i != -1 ? tracks.splice(i,1) : "";
                tracks.length == 0 ? localStorage.removeItem('deezerPlaylist') : localStorage.setItem('deezerPlaylist', JSON.stringify(tracks));;
                document.querySelector('.musicList').querySelector('li[data-id="'+ trackId+'"]').remove();
                if(document.querySelector('.musicList').childElementCount === 1) {
                    document.querySelector('.playlist-content').remove();
                }
                break;

          }
      });
    }
//ne fonctionne pas encore, remplacer la variable text
const exportation = function exportPlaylistToFile() {
    debugger;
    //new Blob([JSON.stringify(variable, null, 2)], {type : 'application/json'});
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    debugger;
   saveAs(blob, "filename.txt"); //fichier.json
}