import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _Tracks() {
     const [{ token, currentPlaying, data, deviceId, playlist }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [dataTmp, setDataTmp]                  = useState(data)

     const getTracks = async () => {
          setSavedTrack([])
          const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          const { items } = response.data;
          items.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.track.id]))
               setTracks(( tracks ) => ([...tracks, {
                    track: {
                         uris: [track.track.uri],
                         position_ms: 0,
                         id: track.track.id,
                    },
                    id: track.track.id,
                    title: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artist: track.track.artists.map((artist) => artist.name),
                    artistId: track.track.artists.map(( artist ) => artist.id),
                    explicit: track.track.explicit,
                    cover: track.track.album.images[2].url,
                    added: AddedDate(track.added_at),
                    duration: ConvertMs(track.track.duration_ms),
                    uri: track.track.uri,
                    url: track.track.external_urls.spotify
               }]))
          })
     };

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

     const getSaved = async () => {
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

     const updateLike = ( idx ) => {
          const newLiked = [...liked];
          newLiked[ idx ] = !newLiked[ idx ]
          setLiked( newLiked )
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     const handleLike = (tmp, val, index) => {
          unlikeTrack(val)
          tracks.splice(index, 1)
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
     }, [tracks])

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [savedTrack])

     useEffect(() => {
          setSavedTrack([])
          setTracks([])
          setLiked([])
          getTracks();
     }, []);

     return (
          <div className='tracks'>
               <p className='title'>My Tracks</p>
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
                                   <div className='tr relative' key={i} id={"tr"+i} 
                                   onDoubleClick={() => {chooseTrack(val.track)}}
                                   onMouseDown={(e) => handleLeftClick(e, i)}
                                   >
                                        <div className="cover td">
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                             <img src={val.cover} alt="cover"/>
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
                                                                      <NavLink className='popup-btn link-btn' to={`/me/artist/?id=${artist}`}>{val.artist[index]}</NavLink>
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
