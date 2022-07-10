import { render, readLess,readMore } from "./utils.js"
const watchlistContainer = document.querySelector(".container-movie-watchlist")
let watchlistArray = JSON.parse(localStorage.getItem("watchlist"))===null? []: JSON.parse(localStorage.getItem("watchlist"))
    
function removeFromWatchlist(id){
    watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
    watchlistArray = watchlistArray.filter(movie =>movie.id != id)
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    displayWatchlist()   
}


function displayWatchlist(){
    if(watchlistArray.length>0){
        watchlistContainer.innerHTML=""
        watchlistArray.map(movie => render(movie,"watchlist", watchlistContainer))
    } else{
        watchlistContainer.innerHTML= `<div class="container-message">
        <p class="info-text">Your watchlist is looking a little empty...</p>
        <div class="link-svg">
            <svg class="in-page-plus-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 
                13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM10.125 5.625C10.125 
                5.00368 9.62132 4.5 9 4.5C8.37868 4.5 7.875 5.00368 7.875 5.625V7.875H5.625C5.00368 
                7.875 4.5 8.37868 4.5 9C4.5 9.62132 5.00368 10.125 5.625 10.125H7.875V12.375C7.875 
                12.9963 8.37868 13.5 9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375V10.125H12.375C12.9963 
                10.125 13.5 9.62132 13.5 9C13.5 8.37868 12.9963 7.875 12.375 7.875H10.125V5.625Z" fill="#363636"/>
            </svg>
            <a class="in-page-search-link" href="index.html">Let's add some movies!</a>
        </div>
    </div>`
    }
}


watchlistContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("read-more"))
        readMore(event.target.dataset.movieId, watchlistArray)
    else if(event.target.classList.contains("read-less"))
        readLess(event.target.dataset.movieId, watchlistArray)
    else if(event.target.classList.contains("remove-from-watchlist"))
        removeFromWatchlist(event.target.dataset.movieId)
})

displayWatchlist()
