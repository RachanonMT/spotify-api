import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'

export default function _AlbumTrack() {
     const albumId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [albums, setAlbums]                    = useState([])
     const [duration, setDuration]                = useState(0)

     const getAlbums = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          setAlbums({
               id: res.data.id,
               name: res.data.name,
               cover: res.data.images[0].url,
               release: res.data.release_date.substring(0,4),
               total: res.data.total_tracks,
               type: res.data.type.toUpperCase(),
               artist: res.data.artists?.map((val) => ({
                    id: val.id,
                    name: val.name,
               }))
          })

          const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          items.map(( track ) => {
               setDuration(( duration ) => duration + track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    album: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": track.track_number-1
                         },
                         "position_ms": 0
                    },
                    no: track.track_number,
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map(( artist ) => artist.name),
                    duration: ConvertMs(track.duration_ms, 0),
                    explicit: track.explicit,
               }]))
          })
     };

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getAlbums()
     }, [])


     return (
          <div className='albums'>
               <div className="playlists_banner">
                    <img className="album_cover" src={ albums.cover } alt='album_art'/>
                    <div className="album_info">
                         <p className="album_type">{ albums.type }</p>
                         <p className="album_name">{ albums.name }</p>
                         <p className="album_artist">
                              {albums.artist?.map(( artist, index ) => {
                                   return <span key={ index }>{ artist.name } </span>
                              })}
                         </p>
                         <p className="album_track_total">
                              <span>{ albums.total } Tracks &nbsp; | &nbsp; {ConvertMs( duration, 1 )}</span>
                         </p>
                         <p className='album_release'>{ albums.release }</p>
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
                         <div className="time th">TIME</div>
                         <div className="track_btn th"></div>
                    </div>
                    <div className='table_body'>
                         {tracks.map(( val ) => {
                              return (
                                   <div className='tr' key={ val.id } onClick={() => { chooseTrack( val.album ) }}>
                                        <div className="num td">{ val.no }</div>
                                        <div className="title td">{ val.name }</div>
                                        <div className="artist td">
                                             {val.artists.join(", ")}
                                        </div>
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
