window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];
    
    let paintingIndex = 0;
    let tourLocation;
    let audio;

    const container = document.getElementById('container')
    const navbar = document.querySelector('nav')

    const metUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    const artworksUrl = "http://localhost:3000/artworks"
    const departmentsUrl = "http://localhost:3000/departments"

    getPaintings()
    getDepartments()

    navbar.addEventListener("click", function(e){
        navbarHandler(e)
    })

    container.addEventListener("click", function(e){
        if(e.target.parentElement.id === "tour"){
            getTourInfo(e, audio)
        } 
    })


    window.addEventListener("click", function(e){
        if (e.target.innerText === "Next" || e.target.innerText === "Previous"){
            indexHandler(e)
        } else if (e.target.id === "artwork"){
            e.target.id = "modal"
            e.target.style.display = "block";
        } else if (e.target.id === "modal"){
            e.target.id = "artwork"
        }
    })

    function indexHandler(e){
        if (e.target.innerText === "Next"){
            paintingIndex++
        } else if (e.target.innerText === "Previous"){
            paintingIndex--
        }
        tour(tourLocation, paintingIndex)
    }

    function navbarHandler(e){
        if (e.target.parentElement.id === "nav-dropdown"){
            getTourInfo(e, audio)
        } else if (e.target.id === "met-logo") {
            resetContainer()
        } else if (e.target.id === "play"){
            playMusic()
        } else if (e.target.id === "pause"){
            pauseMusic(audio)
        }
    }

    function playMusic(){
        audio = getAudio()
        audio.currentTime = 0
        audio.play()
    }

    function pauseMusic(audio){
        if (audio !== undefined){
            audio.pause()
        }
    }

    function getAudio(){
        if (container.children.length === 2 || container.children[2].innerText === "Modern and Contemporary Art"){
            return document.getElementById('rhapsody')
        } if (container.children[2].innerText === "European Paintings"){
            return document.getElementById('european')
        } else if (container.children[2].innerText === "Medieval Art"){
            return document.getElementById('medieval')
        } else if (container.children[2].innerText === "The American Wing"){
            return document.getElementById('american')
        } else if (container.children[2].innerText === "Asian Art"){
            return document.getElementById('asian')
        } else if (container.children[2].innerText === "Greek and Roman Art"){
            return document.getElementById('greek')
        }
    }

    function getTourInfo(e, audio){
        pauseMusic(audio)
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
        return (tourPaintings.length - 1)
    } else {
        return index
    }
   }

   function renderPainting(painting, json){
        container.innerHTML = `
        <img src="${painting.image_url}" id="artwork"></img>
        <p>${json.title}</p>
        <p>${painting.department.name}</p>
        <p>${json.artistDisplayName}</p>
        <a target="_blank" href="${json.objectURL}">See More</a></br>
        <button>Previous</button>
        <button>Next</button>`
   }

   function resetContainer(){
        container.innerHTML = `<h1 class="the-met">The MET</h1>
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
       </div>`
   }
   
})
