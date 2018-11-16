window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];
    
    let paintingIndex = 0;
    let tourLocation;
    let music;

    const container = document.getElementById('container')
    const navbar = document.querySelector('nav')
    const navend = document.querySelector('.nav-right')
    const learnMore = document.getElementById('learn-more')
    const pause = document.getElementById('pause')
    const play = document.getElementById('play')

    const metUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    const artworksUrl = "http://localhost:3000/artworks"
    const departmentsUrl = "http://localhost:3000/departments"

    getPaintings()
    getDepartments()

    window.addEventListener("keydown", function(e){
        if (container.firstElementChild.firstElementChild.children[1].id !== undefined){
                indexHandler(e)
            }
    })

    navbar.addEventListener("click", function(e){
        navbarHandler(e)
    })

    container.addEventListener("click", function(e){
        if(e.target.parentElement.id === "tour"){
            getTourInfo(e, audio)
        } 
    })


    window.addEventListener("click", function(e){
        if (e.target.innerText === ">" || e.target.innerText === "<"){
            indexHandler(e)
        } else if (e.target.id === "artwork"){
            e.target.id = "modal"
            e.target.style.display = "block";
        } else if (e.target.id === "modal"){
            e.target.id = "artwork"
        }
    })

    document.addEventListener('mouseover', handleMouseover)

    function handleMouseover(e){
        if (e.target.id === "artwork"){
            // call paintingOverlay()
            
            console.log('mousing over');
        }
    }

    function indexHandler(e){
        if (e.target.innerText === ">" || e.key === "ArrowRight"){
            paintingIndex++
        } else if (e.target.innerText === "<" || e.key ==="ArrowLeft"){
            paintingIndex--
        }
        // console.log(paintingIndex)
        tour(tourLocation, paintingIndex)
    }

    function navbarHandler(e){
        if (e.target.parentElement.id === "nav-dropdown"){
            getTourInfo(e, music)
        } else if (e.target.id === "met-logo") {
            resetContainer()
        } else if (e.target.id === "play"){
            playMusic(music)
        } else if (e.target.id === "pause"){
            pauseMusic(music)
        }
        else if (e.target.innerText === "Learn More"){
            if (audio !== undefined){
                pauseMusic(audio)
            }
    }
}

    function playMusic(){
        if (typeof(audio) !== "undefined" && audio !== ""){
            audio.pause()
        }

        audio = getAudio()
        audio.currentTime = 0
        audio.play()
        play.innerText = "Restart"
        pause.innerText = "Pause"
    }

    function pauseMusic(){
        if (typeof(audio) !== "undefined" && audio !== ""){
            if (pause.innerText === "Pause"){
                audio.pause()
                pause.innerText = "Unpause"
                play.innerText = "Restart"
            } else if (pause.innerText === "Unpause"){
                audio.play()
                pause.innerText = "Pause"
            }
        }
    }

    function getAudio(music){
        if (music !== undefined){
           pauseMusic(music)
        }
        if (navend.innerText === "" || navend.innerText === "Modern and Contemporary Art"){
            return document.getElementById('rhapsody')
        } if (navend.innerText === "European Paintings"){
            return document.getElementById('european')
        } else if (navend.innerText === "Medieval Art"){
            return document.getElementById('medieval')
        } else if (navend.innerText === "The American Wing"){
            return document.getElementById('american')
        } else if (navend.innerText === "Asian Art"){
            return document.getElementById('asian')
        } else if (navend.innerText === "Greek and Roman Art"){
            return document.getElementById('greek')
        }
    }

    function clearAudio(){
        audio = ""
    }

    function getTourInfo(e){
        if (typeof(audio) !== "undefined"){
            audio.pause()
        }
        clearAudio()
        play.innerText = "Play"
        pause.innerText = "Pause"
        paintingIndex = 0
        name = e.target.innerText
        tourLocation = departmentsArray.find(object => {
            return object.name === name
        })
        tour(tourLocation, paintingIndex)
    }

    function getPaintings(){
        fetch(artworksUrl)
        .then(res => res.json())
        .then(function(json){
            json.forEach(object => {
                paintingsArray.push(object)
            })
        })
    }

    function getDepartments(){
        fetch(departmentsUrl)
        .then(res => res.json())
        .then(function(json){
            json.forEach(object => {
                departmentsArray.push(object)
            })
        })
    }

    function tour(department, paintingIndex){
        navend.innerText = `${department.name}`
       const tourPaintings = paintingsArray.filter(painting => {
           return painting.department_id === department.id
       })

       paintingIndex = indexChecker(paintingIndex, tourPaintings)
    //    console.log(paintingIndex)
    //    console.log(tourPaintings[paintingIndex].api_id)
    
       paintingApiCall(tourPaintings[paintingIndex].api_id)
       .then(function(json) {
           renderPainting(tourPaintings[paintingIndex], json)
       })
    }

   function paintingApiCall(paintingId){
    return fetch(`${metUrl}/${paintingId}`)
       .then(res => res.json())
   }

   function indexChecker(index, tourPaintings){
    if (tourPaintings.length <= index){
        paintingIndex = 0
        return paintingIndex
    } else if (index < 0){
        paintingIndex = (tourPaintings.length - 1)
        return paintingIndex
    } else {
        return index
    }
   }

   function renderPainting(painting, json){
        container.innerHTML = `
        <div class="img__wrap">
            <div class="artwork_display">
            <button class="previous-button"><</button>
            <img src="${painting.image_url}" id="artwork"></img>
            <button class="next-button">></button>
            </div>
            </div>
        </div>`
        learnMore.innerHTML = `<a href="${json.objectURL}" target="_blank">Learn More</button>
        `
   }

   function paintingOverlay(painting){
    // this function gets called when the mouseover happens
    // render an overlay div
    // with the content about the painting
    // we may need to fetch painting again? 
    // figure out how to make the overlay
    // maybe a modal?

    div = `<div class="artwork-description">
        <p>${json.title}</p>
        <p>${painting.department.name}</p>
        <p>${json.artistDisplayName}</p>
        </div>`

   }

   function resetContainer(){
       pause.innerText = "Pause"
       play.innerText = "Play"
       navend.innerText = ""
       learnMore.innerHTML = ""
        container.innerHTML = `<div class="start-screen"><h1 class="the-met">The MET</h1>
        <div class="w3-dropdown-hover">
         <button class="button is-light the-met-start">Start Tour</button>
         <div class="w3-dropdown-content w3-bar-block w3-card-4 dropdown" id="tour">
           <a class="w3-bar-item w3-button">European Paintings</a>
           <a class="w3-bar-item w3-button">Medieval Art</a>
           <a class="w3-bar-item w3-button">Modern and Contemporary Art</a>
           <a class="w3-bar-item w3-button">The American Wing</a>
           <a class="w3-bar-item w3-button">Asian Art</a>
           <a class="w3-bar-item w3-button">Greek and Roman Art</a>
         </div>
       </div>
       </div>`
   }
   
})
