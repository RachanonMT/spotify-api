import React from "react"

export default function Login() {
     const handleClick = () => {
          const client_id = "7f3f70be78ab4bb28bd9d8e8082932fa"
          const redirect_uri = "http://localhost:3000"
          const api_uri = "https://accounts.spotify.com/authorize"
          const scope = [
               "user-read-private",
               "user-read-email",
               "user-modify-playback-state",
               "user-read-playback-state",
               "user-read-currently-playing",
               "user-read-recently-played",
               "user-top-read",
               "user-library-read",
               "user-library-modify",
               "user-follow-read",
               "playlist-read-private",
               "streaming",
               "app-remote-control",
          ]
          window.location.href = `${api_uri}?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(" ")}&show_dialog=true`
     }

     return (
          <div>
               <div className="login-container">
                    <div className="login-logo">
                         <img src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png' />
                    </div>
                    <div className="login-btn" onClick={handleClick}>Connect Spotify</div>
               </div>
          </div>
     )
}

