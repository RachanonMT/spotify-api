import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _AlbumTrack() {
     const albumId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying, data, deviceId, playlist }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [albums, setAlbums]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [duration, setDuration]                = useState(0)
     const [dataTmp, setDataTmp]                  = useState(data)

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
          setTracks([])
          items.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
               setDuration(( duration ) => duration + track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    album: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": track.track_number-1
                         },
                         "position_ms": 0,
                         id: track.id,
                    },
                    no: track.track_number,
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map(( artist ) => artist.name),
                    artistId: track.artists.map(( artist ) => artist.id),
                    duration: ConvertMs(track.duration_ms, 0),
                    explicit: track.explicit,
                    uri: track.uri,
                    url: track.external_urls.spotify,
               }]))
          })
     };

     const getSaved = async () => {
          if(savedTrack.length != 0){
               const id = savedTrack.join(",")
               const res = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               })
               if(liked.length !== 0){
                    for(let i=0; i<res.data.length; i++){
                         if(liked[i] != res.data[i]){
                              updateLike(i)
                         }
                    }
               }else{
                    res.data.map(( like ) => {
                         setLiked(( liked ) => ([...liked, like]))
                    })
               }
          }
     }

     const updateLike = ( idx ) => {
          const newLiked = [...liked];
          newLiked[ idx ] = !newLiked[ idx ]
          setLiked( newLiked )
     }

     const likeTrack = async (id) => {
          await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    ids: [
                         `${id}`
                    ]
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          setDataTmp(( dataTmp ) => dataTmp = dataTmp + 1 )
          const data = dataTmp
          dispatch({ type: reducerCases.SET_DATA, data })
     }

     const unlikeTrack = async (id) => {
          await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          setDataTmp(( dataTmp ) => dataTmp = dataTmp + 1 )
          const data = dataTmp
          dispatch({ type: reducerCases.SET_DATA, data })
     }

     const handleLike = (val, id, index) => {
          if(val == true){
               unlikeTrack(id)
               liked[index] = false
          }else{
               likeTrack(id)
               liked[index] = true
          }
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     const addQueue = async (id) => {
          await axios.post(`https://api.spotify.com/v1/me/player/queue?uri=${id}&device_id=${deviceId}`,
               {

               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
     }

     const addToPlaylist = async (playlistId, trackUri) => {
          await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUri}`,
               {

               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
     }

     const content = document.getElementsByClassName("content")

     function hide(){
          window.onclick = (e) => {
               const allPopup = document.getElementsByClassName('popup')
               for(let i=0; i<allPopup.length; i++){
                    allPopup[i].style.display = "none"
               }
               content[0].onscroll = function() {}
          }
     }

     const handleLeftClick = (event, index) => {
          const scrollTop = content[0].scrollTop
          const popup = document.getElementById(index)
          const playlist = document.getElementById("popup"+index)
          const artist = document.getElementById("artist"+index)
          const allPopup = document.getElementsByClassName('popup')
          const row = document.getElementById("tr"+index).getBoundingClientRect();
          if(event.buttons === 2){
               for(let i=0; i<allPopup.length; i++){
                    allPopup[i].style.display = "none"
               }
               if((event.clientX - row.left) + 550 > window.innerWidth){
                    playlist.style.left = "-230px"
                    if(artist)
                    artist.style.left = "-230px"
                    popup.style.left = `${event.clientX - row.left - 220 -10}px`
               }else{
                    popup.style.left = `${event.clientX - row.left + 10}px`
                    if(event.clientX - row.left < 480){
                         playlist.style.left = "195px"
                         if(artist)
                         artist.style.left = "195px"
                    }
               }
               if((event.clientY * 2) + 160 > window.innerHeight && event.clientY < 450){
                    popup.style.top = `${event.clientY - row.top - 150}px`
               }else if(event.clientY + 430 > window.innerHeight) {
                    popup.style.top = `${event.clientY - row.top - 300}px`
               }else{
                    popup.style.top = `${event.clientY - row.top}px`
               }
               popup.style.display = "block"
               content[0].onscroll = function() {
                    content[0].scrollTo(0, scrollTop);
               }
               hide()
          }
     }

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [data])

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [liked])

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [savedTrack])

     useEffect(() => {
          content[0].onscroll = function() {}
          getAlbums()
     }, [])

     return (
          <div className='albums'>
               <div className="header-info">
                    <img className='image-bg' src={albums.cover}/>
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
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' key={ val.id } id={`tr`+i} onDoubleClick={() => { chooseTrack( val.album ) }} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="num td">
                                             <span>{ val.no }</span>
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack( val.album )}}/>     
                                        </div>
                                        <div className="title td">{ val.name }</div>
                                        <div className="artist td">
                                             {val.artists.join(", ")}
                                        </div>
                                        <div className="time td">{ val.duration }</div>
                                        <div className="track_btn td">
                                             <i className="fa-solid fa-ellipsis"/>
                                             <i className="fa-solid fa-plus"/>
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"} onClick={() => {
                                                  handleLike(liked[i], val.id, i)
                                             }} />
                                        </div>
                                        <div className='popup' id={i} >
                                             <div className='flex'> 
                                                  <div className='popup-image'>
                                                       <img src={albums.cover} />
                                                  </div>
                                                  <div className='popup-info'>
                                                       <p className='name'>{val.name}</p>
                                                       <p className='artist'>{val.artists.join(", ")}</p>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onMouseDown={() => {chooseTrack( val.album )}}>Play Now</div>
                                             <div className='popup-btn' onMouseDown={() => addQueue(val.uri)}>Add To Queue</div>
                                             <hr className='hr'/>
                                             <div className='popup-btn relative popup-playlist-btn'>
                                                  <span>Add To Playlist</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-playlist' id={"popup"+i}>
                                                       <div className='popup-content'>
                                                            <div className='popup-btn flex'>
                                                                 <i className="fa-solid fa-circle-plus"></i>
                                                                 <p>Create New Playlist</p>
                                                            </div>
                                                            <hr className='hr'/>
                                                            {playlist.map(( playlist, i ) => {
                                                                 return (
                                                                      <div className='popup-btn' key={i} onMouseDown={() => addToPlaylist(playlist.id, val.uri)}>{playlist.name}</div>
                                                                 )
                                                            })}
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onClick={() => {handleLike(liked[i], val.id, i)}}>{liked[i]? "Remove From Library":"Add To Library"}</div>
                                             <hr className='hr'/>
                                             {(val.artistId.length == 1) && (<NavLink className='popup-btn link-btn' to={`/me/artist/?id=${val.artistId}`}>Go To Artist</NavLink>)}
                                             {(val.artistId.length > 1) && (<div className='popup-btn relative popup-artist-btn'>
                                                  <span>Go To Artists</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-artist' id={"artist"+i}>
                                                       <div className='popup-content'>
                                                            {val.artistId.map(( artist, index ) => {
                                                                 return (
                                                                      <NavLink className='popup-btn link-btn' to={`/me/artist/?id=${artist}`}>{val.artists[index]}</NavLink>
                                                                 )
                                                            })}
                                                       </div>
                                                  </div>
                                             </div>)}
                                             <div className='popup-btn' onMouseDown={() => {navigator.clipboard.writeText(val.url)}} >Share</div>
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
