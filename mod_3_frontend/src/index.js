window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];
    let paintingIndex = 0;
    let tourLocation;

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
            getTourInfo(e)
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
        if (e.target.innerText === ">"){
            paintingIndex++
        } else if (e.target.innerText === "<"){
            paintingIndex--
        }
        tour(tourLocation, paintingIndex)
    }

    function navbarHandler(e){
        if (e.target.parentElement.id === "nav-dropdown"){
            getTourInfo(e)
        } else if (e.target.id === "met-logo") {
            resetContainer()
        }
    }

    function getTourInfo(e){
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
        <div class="img__wrap">
            <div class="artwork_display">
            <button class="previous-button"><</button>
            <img src="${painting.image_url}" id="artwork"></img>
            <button class="next-button">></button>
            </div>
        </div>`
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
        <a target="_blank" href="${json.objectURL}">See More</a>
        </div>`

   }

   function resetContainer(){
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
