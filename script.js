console.log("Lets write some js")
var songs = [];
async function getSongs(){


    let response = await fetch("http://127.0.0.1:3000/songs");
    let data = await response.text()
    // console.log(data);
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if(element.href.endsWith(".mp3")){
            songs.push({href:element.href, name:element.innerText})
        }
    }

    // console.log(songs);
    return songs;
}

var audio = new Audio();

function playMusic (e) {

    return () => {
        audio.src = e.getElementsByTagName("div")[0].getAttribute('data-href');
        console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerText);
        audio.play();
        document.getElementById("play").src="pause.svg";
        document.querySelector(".songinfo").innerHTML = e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerText;
        document.querySelector(".songtime").innerHTML = '00:00';
    }
}

function convertSecondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    return `${padZero(minutes)}:${padZero(parseInt(remainingSeconds))}`;
  }
  
  function padZero(number) {
    return (number < 10 ? '0' : '') + number;
  }

function initialLoad(data){
    audio.src = data.href;
    document.querySelector(".songinfo").innerHTML = data.name;
    document.querySelector(".songtime").innerHTML = `00:00/00:00`
}

async function main(){

    //get list of all songs
    songs = await getSongs();

    initialLoad(songs[0]);
    
    //render songlist and cards
    
    Array.from(songs).forEach(e =>{ 
        document.querySelector(".songList ul").innerHTML += `<li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info" data-href=${e.href}>
                                <div>${e.name}</div>
                                <div>Artist Name</div>
                            </div>
                            <img src="play.svg" class="invert" alt="">
                        </li>`

        document.querySelector(".cardContainer").innerHTML += `<div class="card" data-href=${e.href}>
                        <img src="https://ts4.mm.bing.net/th?id=OIP.suvHuMJLJ7-e6yS5O4TWSgHaEK&pid=15.1" alt="img">
                        <div class="play">
                            <img src="play.svg" alt="">
                        </div>
                        <h2>${e.name}</h2>
                        <p>Lorem, ipsum dolor.</p>
                    </div>`
    });

    //add event to library list items and cards
    Array.from(document.querySelectorAll(".songList li")).forEach(e=>{
        e.addEventListener("click",playMusic(e));
    });

    // Array.from(document.querySelectorAll(".card")).forEach(e=>{
    //     e.addEventListener("click",playMusic(e));
    // });

    // attaching event to play button
    document.getElementById("play").addEventListener("click",()=>{
        if(audio.paused){
            audio.play();
            document.getElementById("play").src="pause.svg";
        }else{
            audio.pause()
            document.getElementById("play").src="playSong.svg"
        }
    });

    //attacing timeUpdate event
    audio.addEventListener("timeupdate",()=>{
        // console.log(audio.currentTime, audio.duration);
        document.querySelector(".songtime").innerHTML = 
        `${convertSecondsToMinutesSeconds(audio.currentTime)}/${convertSecondsToMinutesSeconds(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime/audio.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        console.log(e.target.getBoundingClientRect().width, e.offsetX)
        let leftPer = parseInt((e.offsetX/e.target.getBoundingClientRect().width) * 100) + '%';
        document.querySelector(".circle").style.left = leftPer;

        audio.currentTime = audio.duration * (e.offsetX/e.target.getBoundingClientRect().width);
    })

    //add an event for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".left").style.left = '0%';
    });

    //event listener for close
    document.querySelector("#close").addEventListener("click",()=>{
            document.querySelector(".left").style.left = '-150%';
    });

    //event listerner for previous and next
    previous.addEventListener("click",()=>{
        let i;
        //get current song and find the index in the array
        for (i = 0; i < songs.length; i++) {
            const element = songs[i];
            if(element.href === audio.src){
                break
            }
        }

        if(songs[i-1]){
            initialLoad(songs[i-1])
            audio.play();
            document.getElementById("play").src="pause.svg";
        }
    });

    next.addEventListener("click",()=>{
        let i;
        //get current song and find the index in the array
        for (i = 0; i < songs.length; i++) {
            const element = songs[i];
            if(element.href === audio.src){
                break
            }
        }

        if(songs[i+1]){
            initialLoad(songs[i+1])
            audio.play();
            document.getElementById("play").src="pause.svg";
        }
    });

} 

main();
