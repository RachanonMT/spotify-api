import { useEffect, useState } from 'react'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function _ListCard({card, uri, savedAlbum, type}) {
     const [{ token, playlist, data }, dispatch] = useStateProvider()
     const [liked, setLiked] = useState([])
     const [popState, setPopState] = useState(false)
     const navigate = useNavigate()

     const getSaved = async () => {
          setLiked([])
          const id = savedAlbum.join(",")
          const res = await axios.get(`https://api.spotify.com/v1/me/albums/contains?ids=${id}`, {
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

     const addToPlaylist = async (playlistId, trackUri) => {
          await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
               {
                    "uris": trackUri
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
                    if(e.target.className != "fa-solid fa-ellipsis more-album"){
                         allPopup[i].style.display = "none"
                         setPopState(false)
                    }
               }
               content[0].onscroll = function() {}
          }
     }

     const handleLeftClick = (event, index, check) => {
          const scrollTop = content[0].scrollTop
          const popup = document.getElementById(index)
          const playlist = document.getElementById("popup"+index)
          const artist = document.getElementById("artist"+index)
          const allPopup = document.getElementsByClassName('popup')
          const row = document.getElementById("tr"+index).getBoundingClientRect();
          if(event.buttons === 2 || check){
               setPopState(true)
               for(let i=0; i<allPopup.length; i++){
                    allPopup[i].style.display = "none"
               }
               if((event.clientX) + 520 > window.innerWidth){
                    playlist.style.left = "-236px"
                    if(artist)
                    artist.style.left = "-236px"
                    popup.style.left = `${event.clientX - row.left - 220 -10}px`
               }else{
                    popup.style.left = `${event.clientX - row.left + 10}px`
                    if(event.clientX < 480){
                         playlist.style.left = "192px"
                         if(artist)
                         artist.style.left = "195px"
                    }
               }
               if((event.clientY * 2) + 160 > window.innerHeight && event.clientY < 450){
                    popup.style.top = `${event.clientY - row.top - 150}px`
               }else if(event.clientY + 430 > window.innerHeight) {
                    popup.style.top = `${event.clientY - row.top - 260}px`
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
          if(savedAlbum.length != 0){
               getSaved()
          }
     }, [savedAlbum])

     useEffect(() => {
          if(savedAlbum.length != 0){
               getSaved()
          }
     }, [card])

     useEffect(() => {
          if(savedAlbum.length != 0){
               getSaved()
          }
     }, [data])
     
     if(type === 0){
          return (
               <div className='show_playlists'>
                    {card.map(( val, i ) => {
                         return (
                              <div className='relative playlist' id={`tr`+i} key={val.id} onClick={() => {!popState?navigate(`/me/album/?id=${val.id}`):null}} onMouseDown={(e) => handleLeftClick(e, i, false)}>
                                   <div className='playlist_image'>
                                        <div className='relative hover-cover'>
                                             <img className='relative' src={val.cover} alt='cover'/>
                                             <div className='fade'/>
                                             <i className="fa-solid fa-play play-album"/>
                                             <i className="fa-solid fa-ellipsis more-album" onClick={(e) => handleLeftClick(e, i, true)} onMouseDown={()=>setPopState(true)}/>
                                             <div className='save'>
                                                  <i className={liked[i]?"fa-solid fa-heart save-album highlight":"fa-regular fa-heart save-album"}/>
                                             </div>
                                        </div>
                                   </div>
                                   <p className='playlist_name'>{val.name}</p>
                                   <p className='create_by'>{val.artists?.map(( val, i ) => {
                                        return <span key={i}>{val}</span>
                                   })}</p>
                                   <p className='tracks_number'>{val.release_date}</p>
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
                                                       {playlist.map(( playlist, index ) => {
                                                            return (
                                                                 <div className='popup-btn' key={index} onMouseDown={() => addToPlaylist(playlist.id, uri[0][i])}>{playlist.name}</div>
                                                            )
                                                       })}
                                                  </div>
                                             </div>
                                        </div>
                                        <div className='popup-btn'>Add To Library</div>
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
          )
     }
}
