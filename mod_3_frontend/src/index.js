window.addEventListener('DOMContentLoaded', function(){
    let paintingsArray;
    let paintings;
    const tourButton = document.querySelector('button')
    const paintingDiv = document.getElementById('painting')
    const url = "https://collectionapi.metmuseum.org/public/collection/v1/objects"

    // How does the frontend get the data from the BACKEND
    tourButton.addEventListener("click", function(e){
        randInt = Math.floor(Math.random() * Math.floor(472721))
        fetch(`${url}/${randInt}`)
        .then(res => res.json())
        .then(function(json){
            paintingDiv.innerHTML = `
            <img src="${json.primaryImage}"></img>
            <p>${json.title}</p>
            <p>${json.artistDisplayName}</p>
            <p>${json.department}</p>
            <a href="${json.objectURL}">See More</a>
            <button></button>`
        })
        }
    )
})
