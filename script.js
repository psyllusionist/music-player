const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const volumeBtn = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeContainer = document.getElementById('volume');

// Music
let songs = [];

class song {
    constructor(name, displayName, artist) {
        this.name = name;
        this.displayName = displayName;
        this.artist = artist;
    }
}

const addSong = (name, displayName, artist) => {
    songs.push(new song(name, displayName, artist))
}

addSong('song-1', 'Electric Chill Machine', 'Jacinto Design');
addSong('song-2', 'Seven Nation Army (Remix)', 'Jacinto Design');
addSong('song-3', 'Goodnight, Disco Queen', 'Jacinto Design');
addSong('metric-1', 'Front Row (Remix)', 'Metric/Jacinto Design');

music.volume = (Number(volumeSlider.value) / 100)

// Check if playing
let isPlaying = false;

// Play
const playSong = () => {
    isPlaying = true;
    music.play();
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
}

// Pause
const pauseSong = () => {
    isPlaying = false;
    music.pause();
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}

// Update DOM
const loadSong = (song) => {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// Current Song
let songIndex = 0;

//Next Song
const nextSong = () => {
    songIndex++;
    if (songIndex > songs.length-1) songIndex = 0;
    loadSong(songs[songIndex]);
    !isPlaying ? pauseSong() : playSong();
}

//Previous Song
const prevSong = () => {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length-1;
    loadSong(songs[songIndex]);
    !isPlaying ? pauseSong() : playSong();
}

// On Load - Select First Song
loadSong(songs[songIndex]);

// Update Progress Bar & Time
const updateProgressBar = (e) => {
    const { currentTime, duration } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
        if(durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    // Delay switching duration Element to avoid NaN
    if(durationSeconds) durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    // Calculate display for current
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
        if(currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;     
}

// Set Progress Bar
function setProgressBar(e) {
    // Fire only when the target is the slider
        if(e.target.className.includes("slider")) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const { duration } = music;
        const widthPercent = clickX / width;
        music.currentTime = duration * widthPercent;
        
    }
}

// Toggle volume and slider
const toggleVolume = (e) => {
    volumeSlider.classList.remove('hide-volume-slider');
    volumeBtn.classList.add('hide-volume-btn');
}

const toggleSlider = () => {
        volumeSlider.classList.add('hide-volume-slider');
        volumeBtn.classList.remove('hide-volume-btn');
}


// Set volume
const setVolume = (e) => {
    music.volume = Number(volumeSlider.value) / 100;
    // Set the volume icon
    if(!music.volume) volumeBtn.classList.replace('fa-volume-low', 'fa-volume-xmark');
    else if(music.volume) volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-low');
    if(music.volume > 0.5) volumeBtn.classList.replace('fa-volume-low', 'fa-volume-high');
    else if(music.volume < 0.5) volumeBtn.classList.replace('fa-volume-high', 'fa-volume-low');
}

// Event Listeners
playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('loadeddata', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);
document.addEventListener('click', (e) => e.target.className.includes("volume") ? toggleVolume() : toggleSlider());
volumeSlider.addEventListener('input', setVolume);