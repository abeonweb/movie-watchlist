
/**
 * used to render each movie to the screen
 * works for both movie and watchlist array
 * @param {*} movie  each listing of the array
 * @param {*} arrayName  used to identify link to add (add or remove button)
 * @param {*} container  element in html that holds the content/
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
                    ${movie.ratings[0] && movie.ratings[0].Value.length>=3? 
                        movie.ratings[0].Value.slice(0,3):"No rating"}
                </span>
            </div>
            <div class="movie-runtime-genre-watchlist">
                <span class="runtime">${movie.runtime}</span> 
                <span class="genre">${movie.genre}</span>
                ${ 
                    arrayName ==="movieArray"?
                    `<button class="add-to-watchlist"  data-movie-id=${movie.id}>
                        <svg class="add-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 
                        9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM10.125 
                        5.625C10.125 5.00368 9.62132 4.5 9 4.5C8.37868 4.5 7.875 5.00368 7.875 
                        5.625V7.875H5.625C5.00368 7.875 4.5 8.37868 4.5 9C4.5 9.62132 5.00368 10.125 5.625 
                        10.125H7.875V12.375C7.875 12.9963 8.37868 13.5 9 13.5C9.62132 13.5 10.125 12.9963 
                        10.125 12.375V10.125H12.375C12.9963 10.125 13.5 9.62132 13.5 9C13.5 8.37868 12.9963 
                        7.875 12.375 7.875H10.125V5.625Z" fill="#363636"/>
                        </svg>
                        Watchlist
                    </button>`
                    :
                    `<button class="remove-from-watchlist"  data-movie-id=${movie.id}>
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
 * if the plot > 165, add readMore and readLess
 * readMore will slice out and display 150 characters, add 3 dots
 * and a readLess button
 * 
 *  unique ID is used to search the movieArray and swap text
 */
 function readMore(id, array){
    const plot = document.getElementById("plot"+id)
    for(const movie of array){
        if(movie.id === id){
            plot.innerHTML= movie.fullPlot
        }
    }
}

/**
 * if the plot > 165, add readMore and readLess
 * readMore will slice out and display 150 characters, add 3 dots
 * and a readLess button
 * 
 *  unique ID is used to search the movieArray and swap text
 */
function readLess(id, array){
    const plot = document.getElementById("plot"+id)
    for(const movie of array){
        if(movie.id === id){
            plot.innerHTML=movie.plot
        }
    }
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
        movie.plot +=`... <button class="read-more" data-movie-id=${movie.id}>Read more</button>`
        movie.fullPlot +=` <button class="read-less" data-movie-id=${movie.id}>Less</button>`
    } else{
        movie.plot = movie.fullPlot
    }
}

export {render, readLess, readMore, plotLength}