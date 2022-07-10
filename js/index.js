import { render, readLess, readMore, plotLength } from "./utils.js"

const searchInput = document.querySelector(".search-input")
const movieContainer = document.querySelector(".container-movie-list")
const searchForm = document.querySelector(".search-form")
const noDataMessage = `Unable to find what you’re looking for. Please try another search.`

let movieArray= []

localStorage.setItem("movieArray", JSON.stringify(movieArray))

async function movieSearch(event){
    event.preventDefault()
    movieArray = []
    let value = searchInput.value
    const response= await fetch(
        `https://www.omdbapi.com/?s=${value}&apikey=8bf518a9&page=4type=movie,series,episode`,
        )
    const data = await response.json()
    if(data.Response ==="True"){
        movieContainer.innerHTML="" 
        data.Search.map(index =>getMovieInfo(index.imdbID))
    } else{
        movieContainer.innerHTML=`
        <div class="container-message">
        <p class="info-text">${noDataMessage}</p>
        </div>`
    }
    searchInput.value=""
}
        
async function getMovieInfo(imdbID){
    const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=8bf518a9&type=movie,series,episode`)
    const data = await response.json()
    
    //create a movie object to control the data 
    //and possible add to watchlist
    const movie = {
        title: data.Title,
        ratings: data.Ratings,
        runtime: data.Runtime,
        genre: data.Genre,
        plot: "",
        fullPlot: data.Plot,
        poster: data.Poster,
        id: imdbID
    }

    plotLength(movie) 
    
    //insert in movieArray       
    movieArray.push(movie)
    localStorage.setItem("movieArray", JSON.stringify(movieArray))
    render(movie,"movieArray", movieContainer)
    
}


/**
* check if not already in watchlist
* @param {*} id used to identify the unique movie
*  
*/
function addToWatchlist(id){
    
    movieArray= JSON.parse(localStorage.getItem("movieArray"))
    let watchlistArray= JSON.parse(localStorage.getItem("watchlist"))
    if(!watchlistArray) watchlistArray=[]
    if(watchlistArray.find(movie =>movie.id===id)){
        return
    } else{
        watchlistArray.push(movieArray.find(movie =>movie.id===id))
        localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    }        
}


//================= Event Listeners ====================

searchForm.addEventListener("submit", movieSearch)

movieContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("read-more"))
        readMore(event.target.dataset.movieId, movieArray)
    else if(event.target.classList.contains("read-less"))
        readLess(event.target.dataset.movieId, movieArray)
    else if(event.target.classList.contains("add-to-watchlist"))
        addToWatchlist(event.target.dataset.movieId)
})

