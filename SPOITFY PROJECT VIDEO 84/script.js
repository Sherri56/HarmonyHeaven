//we are about to get songs from server using api, as we have not included any backend yet
console.log("Lets write javascript")
let songs;
let currFolder;
let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
   if(isNaN(seconds)|| seconds < 0)
   {
    return "00:00";
   }
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor (seconds % 60); 

   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0');
   return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder)
{
    currFolder = folder;
let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3"))
    {
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}

//show all the songs in the playlist
let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUl.innerHTML = ""
for (const song of songs) 
{
    songUl.innerHTML = songUl.innerHTML + `<li> 
    
    <img class="invert" src="img/music.svg" alt="music">
    <div class="info">
        <div> ${song.replaceAll("%20", " ")}</div>
        <div>Sherri</div>
    </div>
    <div class="playnow">
        <span>Play Now</span>
    <img src="img/playsong.svg" class="invert" alt="">
</div> </li>`;   
}


//attach an event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    
})

}
const playMusic = (track) =>
{
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
}
async function displayAlbums()
{
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
            if(e.href.includes("/songs"))
            {
                let folder = (e.href.split("/").slice(-2)[0])
                //get metadata of the folder
                let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
                let response = await a.json(); 
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#141b34" stroke-width="1.5" stroke-linejoin="round" fill="#000" />
                </svg>
                </div>
                <img src="/songs/${folder}/cover"
                    alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`
            }
        }
    console.log(anchors)
}
async function main()
{
    //get the list of all songs
await getSongs("songs/HotHits")
playMusic(songs[0], true)

//display all the albums on the page
displayAlbums()

//Attach an event listner to play next and previous
play.addEventListener("click", ()=>
{
    if(currentSong.paused)
    {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    else
    {
        currentSong.pause()
        play.src = "img/playsong.svg"
    }
})

//listen for timeupdate event
currentSong.addEventListener("timeupdate",()=>
{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";

})

//add an event listner to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>
{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration) * percent)/ 100;
})

//add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>
{
    document.querySelector(".left").style.left = "0"
})

//add an event listner for closeButton
document.querySelector(".close").addEventListener("click",()=>
{
    document.querySelector(".left").style.left = "-120%"
})


//add an event listner to previous
previous.addEventListener("click",()=>
{
    console.log("Previous Clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) >= 0)
    playMusic(songs[index-1]);
})

//add an event listner to next 
next.addEventListener("click",()=>
{
    currentSong.pause()
    console.log("Next Clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length)
    playMusic(songs[index+1]);
})


//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
{
    console.log(e, e.target, e.target.value)
    currentSong.volume = parseInt(e.target.value)/100
})

//load the playlist whenever the card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        console.log(item.target,item.currentTarget.dataset)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        
    })
})

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})

}
main()