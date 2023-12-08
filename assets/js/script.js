const apiUrl = 'https://mp3quran.net/api/v3';
const language = 'ar';
async function getReciters() {
    const chooseReciter = document.querySelector('#chooseReciter')
    chooseReciter.innerHTML += `<option value="">اختر قارئ</option>`;

    const res = await fetch(`${apiUrl}/reciters?language=${language}`);
    const data = await res.json();

    data.reciters.forEach(reciter => chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`);
    chooseReciter.addEventListener('change', e => getMoshaf(e.target.value))

}
getReciters();

async function getMoshaf(reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf')
    //GET https://www.mp3quran.net/api/v3/reciters?language=eng&reciter=168
    const res = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf;

    chooseMoshaf.innerHTML += `<option value=""data-server=""data-surahList="">اختر مصحف</option>`

    moshafs.forEach(moshaf => chooseMoshaf.innerHTML += `<option 
        value="${moshaf.id}"
        data-server="${moshaf.server}"
        data-surahList="${moshaf.surah_list}">
        ${moshaf.name}</option>`);
    chooseMoshaf.addEventListener('change', e => {
        const selectedMosfah = chooseMoshaf.options[chooseMoshaf.selectedIndex]
        const surahServer = selectedMosfah.dataset.server;
        const surahList = selectedMosfah.dataset.surahlist;
        getSurah(surahList, surahServer);
    })

}

async function getSurah(surahList, surahServer) {
    const chooseSurah = document.querySelector('#chooseSurah')

    //GET https://mp3quran.net/api/v3/suwar
    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const surahNames = data.suwar;


    surahList = surahList.split(',');
    surahList.forEach(surah => {
        const padSurah = surah.padStart(3, '0');
        chooseSurah.innerHTML += `<option value="">اختر سورة</option>`
        surahNames.forEach(surahName => {
            if (surahName.id == surah)
                chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>`
        })
    })

    chooseSurah.addEventListener('change', e => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
        playSurah(selectedSurah.value);
        console.log(selectedSurah.value);
    })

}
function playSurah(surahMp3) {
    const audioPlayer = document.querySelector('#audioPlayer')
    audioPlayer.src = surahMp3;
    audioPlayer.addEventListener('loadedmetadata', function () {
        // The audio has loaded, it's safe to play now
        audioPlayer.play();
    });
}
function playLive(channel) {
    if (Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
}