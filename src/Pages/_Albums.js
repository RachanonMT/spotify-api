import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import { NavLink, useNavigate } from 'react-router-dom'
import _ListTrack from './_ListTrack'

export default function _Albums() {
     const [{ token, playlist }, dispatch] = useStateProvider()
     const [albums, setAlums] = useState([])
     const [albumUri, setAlbumUri] = useState([])
     const navigate = useNavigate();
     
     const getAlbums = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/albums`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          setAlbumUri(( albumUri ) => ([...albumUri, items.map(( album ) => album.album.tracks.items.map(( val ) => val.uri))]))
          items.map(( album ) => {
               setAlums(albums => ([...albums, {
                    album: {
                         "context_uri": album.album.uri,
                         "offset": {
                              "position": 0
                         },
                         "position_ms": 0,
                         id: album.album.tracks.items[0].id,
                    },
                    id: album.album.id,
                    name: album.album.name,
                    cover: album.album.images[0]?.url,
                    artists: album.album.artists.map(( artist ) => artist.name),
                    artistId: album.album.artists.map(( artist ) => artist.id),
                    release_date: album.album.release_date.substring(0,4),
                    tracks_url: album.album.tracks.href,
                    track_total: album.album.total_tracks,
                    url: album.album.external_urls.spotify,
               }]))
               return true
          })
     };

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
               if((event.clientX) + 520 > window.innerWidth){
                    playlist.style.left = "-226px"
                    if(artist)
                    artist.style.left = "-226px"
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
          getAlbums()
     }, [])

     return (
          <div>
               <p className='title'>My Albums</p>
               <div className='show_playlists'>
                    {albums.map(( val, i ) => {
                         return (
                              <div className='relative playlist' id={`tr`+i} key={val.id} onClick={() => {navigate(`/me/album/?id=${val.id}`);}} onMouseDown={(e) => handleLeftClick(e, i)}>
                                   <div className='playlist_image'>
                                        <img src={val.cover} alt='cover'/>
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
                                                                 <div className='popup-btn' key={index} onMouseDown={() => addToPlaylist(playlist.id, albumUri[0][i])}>{playlist.name}</div>
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
          </div>
     )
}
