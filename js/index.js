const searchInput = document.querySelector(".search-input")
const movieContainer = document.querySelector(".container-movie-list")
const form = document.querySelector("form")

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
    // let value = watchlistArray.find(movie =>movie.id===id)
    if(watchlistArray.find(movie =>movie.id===id)){
        return
    } else{
        watchlistArray.push(movieArray.find(movie =>movie.id===id))
        localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    }        
}



/**
 * if the plot > 165, add readMore and readLess
 * readMore will slice out and display 150 characters, add 3 dots
 * and a readLess button
 * 
 *  unique ID is used to search the movieArray and swap text
 */
function readMore(id){
    const more = document.getElementById("plot"+id)
    for(const movie of movieArray){
        if(movie.id === id){
            more.innerHTML=movie.fullPlot
        }
    }
}

function readLess(id){
    const less = document.getElementById("plot"+id)
    for(const movie of movieArray){
        if(movie.id === id){
            less.innerHTML=movie.plot
        }
    }
}


/**
 * pass an array and an id to distinguish the array
 */
 function render(movie, arrayName, container){

    container.innerHTML +=`
    <div class="movie-listing">
        <div class="movie-info">
            <div class="movie-title-rating">
                <h2 class="movie-title">${movie.title}</h2>
                <span class="rating">
                    <svg class="rating-star-svg" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                    </svg>
                    ${movie.ratings[0].Value.length>=3? movie.ratings[0].Value.slice(0,3):"No rating"}
                </span>
            </div>
            <div class="movie-runtime-genre-watchlist">
                <span class="runtime">${movie.runtime}</span> 
                <span class="genre">${movie.genre}</span>
                ${ 
                    arrayName ==="movieArray"?
                    `<button class="add-to-watchlist"  onclick = "addToWatchlist('${movie.id}')">
                        <svg class="add-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM10.125 5.625C10.125 5.00368 9.62132 4.5 9 4.5C8.37868 4.5 7.875 5.00368 7.875 5.625V7.875H5.625C5.00368 7.875 4.5 8.37868 4.5 9C4.5 9.62132 5.00368 10.125 5.625 10.125H7.875V12.375C7.875 12.9963 8.37868 13.5 9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375V10.125H12.375C12.9963 10.125 13.5 9.62132 13.5 9C13.5 8.37868 12.9963 7.875 12.375 7.875H10.125V5.625Z" fill="#363636"/>
                        </svg>
                        Watchlist
                    </button>`
                    :
                    `<button class="remove-from-watchlist"  onclick = "removeFromWatchlist('${movie.id}')">
                        <svg class="remove-svg" width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 
                        3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7C4.44772 
                        7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H11C11.5523 9 12 8.55229 12 8C12 7.44772 
                        11.5523 7 11 7H5Z" fill="#111827"/>
                        </svg>                    
                        Remove
                    </button>`
                }
            </div>
                <p id='plot${movie.id}' class="movie-plot">${movie.plot}</p>
            </div>
            <div class="movie-poster">
                <img class="movie-poster-img" src=${movie.poster} alt="Poster for ${movie.title}">
            </div>
    </div>`
}

/**
* determines length of plot and
* adds buttons that control view of long plots
* also edits N/A plots
* 
* @param {*} movie object from movie array
*/
function plotLength(movie){
if(movie.fullPlot.length < 5){
    movie.plot = "No synopsis available."
}
else if(movie.fullPlot.length > 165){
    movie.plot = movie.fullPlot.slice(0,140)
    movie.plot +=`... <button class="read-more" onclick= "readMore('${movie.id}')">Read more</button>`
    movie.fullPlot +=` <button class="read-less" onclick= "readLess('${movie.id}')">Less</button>`
} else{
    movie.plot = movie.fullPlot
}
}


form.addEventListener("submit", movieSearch)



