import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"

export default function Login() {
     const handleClick = () => {
          const client_id = "7f3f70be78ab4bb28bd9d8e8082932fa"
          const redirect_uri = "http://localhost:3000"
          const api_uri = "https://accounts.spotify.com/authorize"
          const scope = [
               "ugc-image-upload",
               "user-read-playback-state",
               "user-modify-playback-state",
               "user-read-currently-playing",
               "app-remote-control",
               "streaming",
               "playlist-read-private",
               "playlist-read-collaborative",
               "playlist-modify-private",
               "playlist-modify-public",
               "user-follow-modify",
               "user-follow-read",
               "user-read-playback-position",
               "user-top-read",
               "user-read-recently-played",
               "user-library-modify",
               "user-library-read",
               "user-read-email",
               "user-read-private"
          ]
          window.location.href = `${api_uri}?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(" ")}&show_dialog=true`
     }

     return (
          <div>
               <div className="login-container">
                    <div className="login-logo">
                         <LazyLoadImage effect="blur" src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png' />
                    </div>
                    <div className="login-btn" onClick={handleClick}>Connect Spotify</div>
               </div>
          </div>
     )
}

