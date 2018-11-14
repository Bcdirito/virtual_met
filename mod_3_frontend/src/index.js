window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];
    let paintingIndex = 0;
    let tourLocation;

    const container = document.getElementById('container')
    const tourButton = document.getElementById("tour")
    const navbar = document.querySelector('nav')
    const navDropdown = document.getElementById('nav-dropdown')

    const metUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    const artworksUrl = "http://localhost:3000/artworks"
    const departmentsUrl = "http://localhost:3000/departments"

    getPaintings()
    getDepartments()

    navbar.addEventListener("click", function(e){
        if (e.target.parentElement.id === "nav-dropdown"){
            name = e.target.innerText
            tourLocation = departmentsArray.find(object => {
                return object.name === name
            })
            tour(tourLocation, paintingIndex)
        } else if (e.target.innerText === "Home") {
            container.innerHTML = `<h1 class="the-met">The MET</h1>
            <div class="w3-dropdown-hover" id="tour">
             <button class="button is-light the-met-start">Start Tour</button>
             <div class="w3-dropdown-content w3-bar-block w3-card-4 dropdown">
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

    tourButton.addEventListener("click", function(e){
        name = e.target.innerText
        tourLocation = departmentsArray.find(object => {
            return object.name === name
        })
        tour(tourLocation, paintingIndex)
    })


    window.addEventListener("click", function(e){
        if (e.target.innerText === "Next" || e.target.innerText === "Previous"){
            indexHandler(e)
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
       
       paintingApiCall(tourPaintings[paintingIndex].api_id)
       .then(function(json) {
           renderPainting(tourPaintings[paintingIndex], json)
       })
    }

   function paintingApiCall(paintingId){
    return fetch(`${metUrl}/${paintingId}`)
       .then(res => res.json())
   }

   function indexChecker(paintingIndex, tourPaintings){
    if (tourPaintings.length < paintingIndex){
        return 0
    } else if (paintingIndex < 0){
        return (tourPaintings.length - 1)
    } else {
        return paintingIndex
    }
   }

   function renderPainting(painting, json){
        container.innerHTML = `
        <img src="${painting.image_url}"></img>
        <p>${json.title}</p>
        <p>${painting.department.name}</p>
        <p>${json.artistDisplayName}</p>
        <a target="_blank" href="${json.objectURL}">See More</a></br>
        <button>Previous</button>
        <button>Next</button>`
   }
   
})
