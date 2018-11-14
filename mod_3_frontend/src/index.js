window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];
    let paintingIndex = 0;
    let tourLocation;

    const randButton = document.getElementById('random')
    const paintingDiv = document.getElementById('painting')
    const euroButton = document.getElementById('european paintings')

    const metUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    const artworksUrl = "http://localhost:3000/artworks"
    const departmentsUrl = "http://localhost:3000/departments"

    getPaintings()
    getDepartments()

    randButton.addEventListener("click", function(e){
        randomPainting()
    })

    euroButton.addEventListener("click", function(e){
        id = event.target.id
        tourLocation = departmentsArray.find(object => {
            return object.name.toLowerCase() === id
        })
        tour(tourLocation, paintingIndex)
    })

    window.addEventListener("click", function(e){
        if (e.target.innerText === "Next"){
            paintingIndex++
            tour(tourLocation, paintingIndex)
        } else if (e.target.innerText === "Previous"){
            paintingIndex--
            tour(tourLocation, paintingIndex)
        }
    })

    function randomPainting(){
        randInt = Math.floor(Math.random() * Math.floor(472721))
        fetch(`${metUrl}/${randInt}`)
        .then(res => res.json())
        .then(function(json){
            paintingDiv.innerHTML = `
            <img src="${json.primaryImage}"></img>
            <p>${json.title}</p>
            <p>${json.artistDisplayName}</p>
            <p>${json.department}</p>
            <a target="_blank" href="${json.objectURL}">See More</a>
            <button>New Painting</button>`
            })
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

       if (tourPaintings.length < paintingIndex){
           paintingIndex === 0
       } else if (paintingIndex < 0){
           paintingIndex = (tourPaintings.length - 1)
       }
       
       paintingApiCall(tourPaintings[paintingIndex].api_id)
       .then(function(json) {
           renderPainting(tourPaintings[paintingIndex], json)
       })
    }

   function paintingApiCall(paintingId){
    return fetch(`${metUrl}/${paintingId}`)
       .then(res => res.json())
   }

   function renderPainting(painting, json){
        paintingDiv.innerHTML = `
        <img src="${painting.image_url}"></img>
        <p>${json.title}</p>
        <p>${painting.department.name}</p>
        <p>${json.artistDisplayName}</p>
        <a target="_blank" href="${json.objectURL}">See More</a>
        <button>Previous</button>
        <button>Next</button>`
   }
   
})
