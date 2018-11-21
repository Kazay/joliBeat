// Listener on search input to enable keypress validation
let track = document.querySelector('#trackname');

track.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getTrackList();
    }
});

// Retrieve and display the search results
function getTrackList() {
    document.querySelector('.tracklist-content').innerHTML = '';
    let track = document.querySelector('#trackname');
    search(track);
}

const search = function getTrackListFromDeezer(track) {
    fetch(`https://api.deezer.com/search?q=${track.value}&order=RANKING&limit=10`)
    .then(function(response){
        return response.json();
    })
    .then(function(list) {
        let trackList = '<ul class="search-results">';
        trackList += '<li class="search-header"><div class="track-cover"></div><span class="track-title">TITLE</span><span class="track-artist">ARTIST</span><span class="track-duration">TIME</span></li>'
        if(list.data.length > 0)
        { 
            list.data.forEach(element => {
                let duration = secToMin(element.duration);
                trackList += `<li class="search-track" data-id="${element.id}">
                <img class="track-cover" src="${element.album.cover_small}">
                <span class="track-title">${element.title}</span>
                <span class="track-artist">${element.artist.name}</span>
                <span class="track-duration">${duration}</span>
                <audio class="track-player" controls="controls">
                <source src="${element.preview}" type="audio/mp3" />
                Votre navigateur n'est pas compatible
                </audio>
                <button class="validate" onclick="addToPlaylist(${element.id})";>+</button>
            </li>`;
            }, trackList);
        }
        else
            trackList += '<li>Track not found, try something else !</li>';

        trackList += '</ul>';
        document.querySelector('.tracklist-content').innerHTML = trackList;
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

    return digit ;
}

const addToPlaylist = function addTrackToThePlaylist(trackId) {
    //console.log(document.querySelector('.playlistContent').innerHTML.length);
    //debugger;
    if(document.querySelector('.playlist').innerHTML.length == 0) {
        let html = '<div class="playlist-content"><ul class="musicList"></ul></div>';
        document.querySelector('.playlist').innerHTML = html;                                                             
    }
    //récupérer les champs de la chanson correspondant
    var li = document.querySelector('.search-results').querySelector('li[data-id="'+ trackId+'"');
    var title = li.querySelector('.track-title').innerHTML;
    var artist = li.querySelector('.track-artist').innerHTML;
    var liNumber = document.querySelector('.musicList').querySelectorAll('li').length + 1;
    var html = `<li data-id="${trackId}">
    <!--<span class="track-number">${liNumber}</span>-->
    <span class="track-title">${title}</span>
    <span class="track-artist">${artist}</span>
    <span class="track-duration">Très long</span>
    <span class="playButton" onclick="playThisMusic">Play</span>
    </li>`;
    
    //évite les doublons
    if(document.querySelector('.musicList').querySelector('li[data-id="'+ trackId+'"') == null) {
        document.querySelector('.musicList').innerHTML += html;
    }
}

const playThisMusic = function PlayTrackFromPlaylist(track) {
    //envoyer la musique choisie dans le player
}

const getPlaylist = function getTracksInPlaylist() {
    
}