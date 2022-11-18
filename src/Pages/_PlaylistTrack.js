import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _PlaylistTrack() {
     const playlistId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying, data ,playlist, deviceId }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [playlists, setPlaylists]              = useState([])
     const [duration, setDuration]                = useState(0)
     const [dataTmp, setDataTmp]                  = useState(data)

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
          items.map(( track, index ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.track.id]))
               setDuration(( duration ) => duration + track.track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    playlist: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": index
                         },
                         "position_ms": 0,
                         id: track.track.id,
                    },
                    no: num++,
                    id: track.track.id,
                    cover: track.track.album.images[2].url,
                    name: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artists: track.track.artists.map(( artist ) => artist.name),
                    artistId: track.track.artists.map(( artist ) => artist.id),
                    duration: ConvertMs(track.track.duration_ms, 0),
                    explicit: track.explicit,
                    added: track.added_at,
                    uri: track.track.uri,
                    url: track.track.external_urls.spotify,
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

     const removeFromPlaylist = async (trackUri, index) => {
          await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
                    data: {
                         "tracks": [{"uri": trackUri}]
                    }
               },
          )
          updatePlaylist(index)
     }

     const updatePlaylist = (index) => {
          console.log(tracks);
          tracks.splice(index, 1)
          const newPlaylist = [...tracks];
          setTracks(newPlaylist)
     }
     console.log(tracks);
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
          getPlaylists()
     }, [])

     return (
          <div className='playlists'>
               <div className="header-info">
                    <img className='image-bg' src={ playlists.cover }/>
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
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' key={ i } id={`tr`+i} onDoubleClick={() => {chooseTrack(val.playlist)}} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="num td">
                                             <span>{ i+1 }</span>
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.playlist)}}/>
                                        </div>
                                        <div className="title td">{ val.name }</div>
                                        <div className="artist td">
                                             { val.artists.join(", ") }
                                        </div>
                                        <div className="album td">{ val.album }</div>
                                        <div className="time td">{ val.duration }</div>
                                        <div className="track_btn td">
                                             <i className="fa-solid fa-ellipsis"/>
                                             <i className="fa-solid fa-plus"/>
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"} onClick={() => {
                                                  handleLike(liked[i], val.id, i)
                                             }}/>
                                        </div>
                                        <div className='popup' id={i} >
                                             <div className='flex'> 
                                                  <div className='popup-image'>
                                                       <img src={val.cover} />
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
                                             <div className='popup-btn' onClick={() => {removeFromPlaylist(val.uri, i)}}>Remove From Playlist</div>
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
