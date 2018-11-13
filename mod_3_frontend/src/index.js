window.addEventListener('DOMContentLoaded', function(){
    const paintingsArray = [];
    const departmentsArray = [];

    const randButton = document.querySelector('button')
    const paintingDiv = document.getElementById('painting')

    const metUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    const artworksUrl = "http://localhost:3000/artworks"
    const departmentsUrl = "http://localhost:3000/departments"

    getPaintings()
    getDepartments()
    
    console.log(paintingsArray)
    console.log(departmentsArray)

    randButton.addEventListener("click", function(e){
        randomPainting()
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
            <button>Next</button>`
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
})
