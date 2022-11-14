import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'

export default function _PlaylistTrack() {
     const playlistId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [duration, setDuration]                = useState(0)
     const [playlists, setPlaylists]              = useState([])
 
     const getPlaylists = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          setPlaylists({
               id: res.data.id,
               name: res.data.name,
               owner: res.data.owner.display_name,
               cover: res.data.images[0].url,
               total: res.data.tracks.total,
               type: res.data.type.toUpperCase(),
               public: (res.data.public)? "PUBLIC":"PRIVATE",
          })

          const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;

          var num = 1
          items.map(( track ) => {
               setDuration(( duration ) => duration + track.track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    playlist: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": num-1
                         },
                         "position_ms": 0
                    },
                    no: num++,
                    id: track.track.id,
                    name: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artists: track.track.artists.map(( artist ) => artist.name),
                    duration: ConvertMs(track.track.duration_ms, 0),
                    explicit: track.explicit,
                    added: track.added_at,
               }]))
          })
     };

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }
     
     useEffect(() => {
          getPlaylists()
     }, [])

     return (
          <div className='playlists'>
               <div className="playlists_banner">
                    <img className="album_cover" src={ playlists.cover } alt='album_art'/>
                    <div className="album_info">
                         <p className="album_type">{ playlists.public }&nbsp; &nbsp;{ playlists.type }</p>
                         <p className="album_name">{ playlists.name }</p>
                         <p className="playlist_owner">Created By { playlists.owner }</p>
                         <p className="album_track_total">
                              <span>{ playlists.total } Tracks &nbsp; | &nbsp; { ConvertMs( duration, 1 ) }</span>
                         </p>
                    </div>
               </div>
               <div className="album_control">
                    <button className="album_play_btn">
                         <div className="inside_btn">
                              <i className="fa-solid fa-play"></i>
                              Play
                         </div>
                    </button>
               </div>
               <div className="table">
                    <div className='tr'>
                         <div className="num th">#</div>
                         <div className="title th">TITLE</div>
                         <div className="artist th">ARTIST</div>
                         <div className="album th">ALBUM</div>
                         <div className="time th">TIME</div>
                         <div className="track_btn th"></div>
                    </div>
                    <div className='table_body'>
                         {tracks.map(( val ) => {
                              return (
                                   <div className='tr' key={ val.id } onClick={ () => {chooseTrack(val.playlist)} }>
                                        <div className="num td">{ val.no }</div>
                                        <div className="title td">{ val.name }</div>
                                        <div className="artist td">
                                             { val.artists.join(", ") }
                                        </div>
                                        <div className="album td">{ val.album }</div>
                                        <div className="time td">{ val.duration }</div>
                                        <div className="track_btn td">
                                             <i className="fa-solid fa-ellipsis"/>
                                             <i className="fa-solid fa-plus"/>
                                             <i className="fa-solid fa-heart hearted"/>
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
