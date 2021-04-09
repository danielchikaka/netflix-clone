import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchUrl, isLargeRow }) =>
{
    const [movies, setMovies] = useState([]);

    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() =>
    {
        async function fetchData()
        {
            
            const request = await axios.get(fetchUrl);

            
            setMovies(request.data.results);
            
            return request;
            
        }
        fetchData();
        // [] run once when the Row loads and dont run again
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "99%",
        playerVars: {
          autoplay: 1,
        }
      }
    
    const handleClick = (movie) =>
    {

        if (trailerUrl)
        {
            // console.log(trailerUrl, 'show trailer url')
            setTrailerUrl('');
        } else
        {
            movieTrailer(movie?.title || "")
                .then(url =>
                {
                    const urlParams = new URLSearchParams(new URL(url).search);

                    setTrailerUrl(urlParams.get('v'));
                })
                .catch((error) => console.log(error));
            
                // let trailerurl = await axios.get(
                //     `/movie/${movie.id}/videos?api_key=3a4f69120b2686af8198b347c88b5d44`
                //   );
                //   setTrailerUrl(trailerurl.data.results[0]?.key);
        }
    }
    
    
    // console.table(movies);

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                ))}
                <div style={{ padding: "40px" }}>
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
            </div>
            </div>
        </div>
    )
}

export default Row
