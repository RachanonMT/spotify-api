import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _ListTrack({tracks, savedTrack, type, setTracks}) {

     const playlistId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying, data, deviceId, playlist, toggleCreate }, dispatch]  = useStateProvider()
     const [liked, setLiked]                                                              = useState([])
     const [dataTmp, setDataTmp]                                                          = useState(data)
     const content = document.getElementsByClassName("content")

     const getSaved = async () => {
          setLiked([])
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

     const updateLike = ( index ) => {
          const newLiked = [...liked];
          newLiked[index] = !newLiked[index]
          setLiked(newLiked)
     }

     const handleLike = (val, id, index) => {
          if(val == true){
               unlikeTrack(id)
               liked[index] = false
               if(type === 0){
                    tracks.splice(index, 1)
               }
          }else{
               if(type !== 0){
                    likeTrack(id)
                    liked[index] = true
               }
          }
     }

     const updatePlaylist = (index) => {
          if(type === 3){
               tracks.splice(index, 1)
               const newPlaylist = [...tracks];
               setTracks(newPlaylist)
               liked.splice(index, 1)
               const newLiked = [...liked]
               setLiked(newLiked)
               setDataTmp(( dataTmp ) => dataTmp = dataTmp + 1 )
          }
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

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     const hide = () => {
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
               if((event.clientX) + 430 > window.innerWidth){
                    playlist.style.left = "-238px"
                    if(artist){
                         artist.style.left = "-238px"
                    }
                    popup.style.left = `${event.clientX - 530}px`
               }else{
                    popup.style.left = `${event.clientX - 285}px`
                    if(event.clientX - row.left < 480){
                         playlist.style.left = "195px"
                         if(artist){
                              artist.style.left = "195px"
                         }
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

     useEffect(() => {
          if(savedTrack.length != 0){
               getSaved()
          }
     }, [savedTrack])

     useEffect(() => {
          if(savedTrack.length != 0){
               getSaved()
          }
     }, [tracks])

     useEffect(() => {
          if(savedTrack.length != 0){
               getSaved()
          }
     }, [data])

     useEffect(() => {
          if(savedTrack.length != 0){
               getSaved()
          }
          content[0].onscroll = function() {}
     }, [])

     // Tracks Page
     if(type === 0){
          return (
               <div className='table'>
                    <div className='tr'>
                         <div className="cover th"></div>
                         <div className="title th">TITLE</div>
                         <div className="artist th">ARTIST</div>
                         <div className="album th">ALBUM</div>
                         <div className="added th">DATE ADDED</div>
                         <div className="time th">TIME</div>
                         <div className="track_btn th"></div>
                    </div>
                    <div className='table_body'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' key={i} id={"tr"+i} onDoubleClick={() => {chooseTrack(val.track)}} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="cover td">
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                             <img className='img' src={val.cover} alt="cover"/>
                                        </div>
                                        <div className="title td">{val.title}
                                             {val.explicit === true &&
                                             <span className="explicit_tag">E</span>
                                             }
                                        </div>
                                        <div className="artist td">{val.artist.join(", ")}</div>
                                        <div className="album td">{val.album}</div>
                                        <div className="added td">{val.added}</div>
                                        <div className="time td">{val.duration}</div>
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
                                                       <img src={val.cover} />
                                                  </div>
                                                  <div className='popup-info'>
                                                       <p className='name'>{val.name}</p>
                                                       <p className='artist'>{val.artist.join(", ")}</p>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onMouseDown={() => {chooseTrack( val.track )}}>Play Now</div>
                                             <div className='popup-btn' onMouseDown={() => addQueue(val.uri)}>Add To Queue</div>
                                             <hr className='hr'/>
                                             <div className='popup-btn relative popup-playlist-btn'>
                                                  <span>Add To Playlist</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-playlist' id={"popup"+i}>
                                                       <div className='popup-content'>
                                                            <div className='popup-btn flex'>
                                                                 <i className="fa-solid fa-circle-plus"></i>
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artist[index]}</NavLink>
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
          )  
     }
     
     // Albums Page
     if(type === 1){
          return (
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
                                                       <img src={val.image} />
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
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artists[index]}</NavLink>
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
          )
     }

     // Artists Page
     if(type === 2){
          return (
               <div className='table'>
                    <div className='tr'>
                         <div className="cover th"></div>
                         <div className="title th">TITLE</div>
                         <div className="artist th">ARTIST</div>
                         <div className="album th">ALBUM</div>
                         <div className="time th">TIME</div>
                         <div className="track_btn th"></div>
                    </div>
                    <div className='table_body'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' key={val.id} id={`tr`+i} onDoubleClick={() => {
                                        chooseTrack(val.track)
                                   }} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="cover td">
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                             <img src={val.image} alt="cover"/>
                                        </div>
                                        <div className="title td">{val.name}
                                             {val.explicit === true &&
                                             <span className="explicit_tag">E</span>
                                             }
                                        </div>
                                        <div className="artist td">{val.artist.join(", ")}</div>
                                        <div className="album td">{val.album}</div>
                                        <div className="time td">{ConvertMs(val.duration)}</div>
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
                                                       <img src={val.image} />
                                                  </div>
                                                  <div className='popup-info'>
                                                       <p className='name'>{val.name}</p>
                                                       <p className='artist'>{val.artist.join(", ")}</p>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onMouseDown={() => {chooseTrack( val.track )}}>Play Now</div>
                                             <div className='popup-btn' onMouseDown={() => addQueue(val.uri)}>Add To Queue</div>
                                             <hr className='hr'/>
                                             <div className='popup-btn relative popup-playlist-btn'>
                                                  <span>Add To Playlist</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-playlist' id={"popup"+i}>
                                                       <div className='popup-content'>
                                                            <div className='popup-btn flex'>
                                                                 <i className="fa-solid fa-circle-plus"></i>
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artist[index]}</NavLink>
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
          )
     }

     // Playlist Page
     if(type === 3){
          return (
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
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artists[index]}</NavLink>
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
          )
     }

     // Home Page
     if(type === 4){
          return (
               <div className='table'>
                    <div className='table_body'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' id={`tr`+i} key={val.id} onDoubleClick={() => {chooseTrack(val.track)}} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="cover td">
                                             <img className='img' src={val.image} alt="cover"/>
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                        </div>
                                        <div className="title td">{val.name}
                                             {val.explicit === true &&
                                             <span className="explicit_tag">E</span>
                                             }
                                        </div>
                                        <div className="artist td">{val.artist.join(", ")}</div>
                                        <div className="album td">{val.album}</div>
                                        <div className="time td">{val.duration}</div>
                                        <div className="track_btn td">
                                             <i className="fa-solid fa-ellipsis"/>
                                             <i className="fa-solid fa-plus"/>
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"} onClick={
                                                  () => {handleLike(liked[i], val.id, i)}
                                             }/>
                                        </div>
                                        <div className='popup' id={i} >
                                             <div className='flex'> 
                                                  <div className='popup-image'>
                                                       <img src={val.image} />
                                                  </div>
                                                  <div className='popup-info'>
                                                       <p className='name'>{val.name}</p>
                                                       <p className='artist'>{val.artist.join(", ")}</p>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onMouseDown={() => {chooseTrack( val.track )}}>Play Now</div>
                                             <div className='popup-btn' onMouseDown={() => addQueue(val.uri)}>Add To Queue</div>
                                             <hr className='hr'/>
                                             <div className='popup-btn relative popup-playlist-btn'>
                                                  <span>Add To Playlist</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-playlist' id={"popup"+i}>
                                                       <div className='popup-content'>
                                                            <div className='popup-btn flex'>
                                                                 <i className="fa-solid fa-circle-plus"></i>
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artist[index]}</NavLink>
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
          )
     }

     // Search Page
     if(type === 5){
          return (
               <div className='search_track'>
                    <p className='search_title'>Tracks</p>
                    <div className='search_track_row'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr relative' key={val.id} id={`tr`+i} onDoubleClick={() => {chooseTrack(val.track)}} onMouseDown={(e) => handleLeftClick(e, i)}>
                                        <div className="cover td relative">
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                             <img className='img' src={val.image} alt="cover"/>
                                        </div>
                                        <div className="title td">{val.name}
                                             {val.explicit === true &&
                                                  <span className="explicit_tag">E</span>
                                             }
                                             <p className='artist'>{val.artist[0].name}</p>
                                        </div>
                                        <div className="time td">{val.duration}</div>
                                        <div className="track_btn td">
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"}/>
                                        </div>
                                        <div className='popup' id={i} >
                                             <div className='flex'> 
                                                  <div className='popup-image'>
                                                       <img src={val.image} />
                                                  </div>
                                                  <div className='popup-info'>
                                                       <p className='name'>{val.name}</p>
                                                       <p className='artist'>{val.artist.join(", ")}</p>
                                                  </div>
                                             </div>
                                             <div className='popup-btn' onMouseDown={() => {chooseTrack( val.track )}}>Play Now</div>
                                             <div className='popup-btn' onMouseDown={() => addQueue(val.uri)}>Add To Queue</div>
                                             <hr className='hr'/>
                                             <div className='popup-btn relative popup-playlist-btn'>
                                                  <span>Add To Playlist</span>
                                                  <i className="fa-solid fa-chevron-right more"></i>
                                                  <div className='popup-playlist' id={"popup"+i}>
                                                       <div className='popup-content'>
                                                            <div className='popup-btn flex'>
                                                                 <i className="fa-solid fa-circle-plus"></i>
                                                                 <p onClick={() => {const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}}>Create New Playlist</p>
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
                                                                      <NavLink className='popup-btn link-btn' key={index} to={`/me/artist/?id=${artist}`}>{val.artist[index]}</NavLink>
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
          )
     }

}
