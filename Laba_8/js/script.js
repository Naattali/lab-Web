class MusicPlayer {
    constructor() {
        this.songs = new Map([
            ['song1', {title: 'Смешарики Обормот', file: 'resources/music/Obormot (Remix) - Smeshariki.m4a'}],
            ['song2', {title: 'Барбарики', file: 'resources/music/Барбарики - Барбарики.m4a'}],
            ['song3', {title: 'В лесу родилась ёлочка', file: 'resources/music/В_лесу_родилась_ёлочка_Детские_песни.m4a'}],
            ['song4', {title: 'Как на войне', file: 'resources/music/Как на войне - Агата Кристи.m4a'}],
            ['song5', {title: 'Песенка о лете', file: 'resources/music/Песенка о лете - Детский хор.m4a'}],
            ['song6', {title: 'Разукрасим все планеты', file: 'resources/music/Разукрасим_все_планеты_Барбарики.m4a'}],
            ['song7', {title: 'Ну где же ручки', file: 'resources/music/Ручки - Вирус.m4a'}],
            ['song8', {title: 'С днем рождения', file: 'resources/music/С днем рождения - Барбарики.m4a'}],
            ['song9', {title: 'Тучи тучи тучи', file: 'resources/music/Тучи - Иванушки International.m4a'}],
            ['song10', {title: 'Что такое доброта', file: 'resources/music/Что_такое_доброта_Группа_Барбарики.m4a'}]
        ]);

        this.audio = document.getElementById('audio-player');
        this.songInfo = document.getElementById('song-info');
        this.progressBar = document.getElementById('progress-bar');
        this.playlistElement = document.getElementById('playlist');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.intervalInput = document.getElementById('interval');

        this.isPlaying = false;
        this.timer = null;
        this.currentSong = null;
        this.playedSongs = new Set();

        this.init();
    }

    init() {
        this.renderPlaylist();
        this.setupEventListeners();
        this.checkAudioSupport();
    }

    checkAudioSupport() {
        const testAudio = document.createElement('audio');
        const canPlayMp3 = !!testAudio.canPlayType('audio/mpeg');
        
        if (!canPlayMp3) {
            this.showError('Ваш браузер не поддерживает формат m4a');
        }
    }

    showError(message) {
        this.songInfo.textContent = message;
        this.songInfo.style.color = '#ff5252';
    }

    renderPlaylist() {
        this.playlistElement.innerHTML = '';
        this.songs.forEach((song, id) => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.dataset.songId = id;
            li.addEventListener('click', () => this.playSong(id));
            this.playlistElement.appendChild(li);
        });
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startPlayback());
        this.stopBtn.addEventListener('click', () => this.stopPlayback());

        this.audio.addEventListener('timeupdate', () => this.updateProgressBar());
        this.audio.addEventListener('ended', () => this.songEnded());
        this.audio.addEventListener('error', () => {
            this.showError('Ошибка загрузки аудиофайла');
            this.skipToNextSong();
        });
    }

    startPlayback() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.startBtn.classList.add('pulse');
        this.playRandomSong();
        
        const interval = parseInt(this.intervalInput.value) * 1000;
        this.timer = setInterval(() => {
            if (!this.audio.paused) return;
            this.playRandomSong();
        }, interval);
    }

    stopPlayback() {
        this.isPlaying = false;
        this.startBtn.classList.remove('pulse');
        clearInterval(this.timer);
        this.audio.pause();
        this.songInfo.textContent = 'Воспроизведение остановлено';
        this.songInfo.style.color = '#4fc3f7';
        this.progressBar.style.width = '0%';
        
        document.querySelectorAll('#playlist li').forEach(li => {
            li.classList.remove('playing');
        });
    }

    playRandomSong() {
        if (this.playedSongs.size === this.songs.size) {
            this.playedSongs.clear();
        }

        const availableSongs = Array.from(this.songs.keys()).filter(
            id => !this.playedSongs.has(id)
        );

        if (availableSongs.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        const songId = availableSongs[randomIndex];
        this.playSong(songId);
    }

    async playSong(songId) {
        const song = this.songs.get(songId);
        if (!song) return;

        try {
            const response = await fetch(song.file, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error('File not found');
            }

            this.currentSong = songId;
            this.playedSongs.add(songId);
            this.audio.src = song.file;
            this.audio.onerror = null;
            
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                await playPromise
                    .then(() => {
                        this.songInfo.textContent = `Сейчас играет: ${song.title}`;
                        this.songInfo.style.color = '#718ef0';
                        
                        document.querySelectorAll('#playlist li').forEach(li => {
                            li.classList.remove('playing');
                            if (li.dataset.songId === songId) {
                                li.classList.add('playing');
                            }
                        });
                    })
                    .catch(error => {
                        this.showError('Ошибка воспроизведения: ' + error.message);
                        this.skipToNextSong();
                    });
            }
        } catch (error) {
            this.showError('Файл не найден: ' + song.title);
            this.skipToNextSong();
        }
    }

    skipToNextSong() {
        if (this.isPlaying) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.playRandomSong();
                }
            }, 2000);
        }
    }

    songEnded() {
        if (this.isPlaying) {
            const interval = parseInt(this.intervalInput.value) * 1000;
            setTimeout(() => {
                if (this.isPlaying) {
                    this.playRandomSong();
                }
            }, interval);
        }
    }

    updateProgressBar() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;
        
        if (isFinite(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progressPercent}%`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});