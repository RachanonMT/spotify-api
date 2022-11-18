import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _ArtistTrack() {
     const artistId = new URLSearchParams( window.location.search).get("id" )
     const [{ token, currentPlaying, data }, dispatch]  = useStateProvider()
     const [ artist, setArtist ]                  = useState([])
     const [ tracks, setTracks ]                  = useState([])
     const [ albums, setAlbums ]                  = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [dataTmp, setDataTmp]                  = useState(data)

     const getArtist = async () => {
          setTracks([])

          const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=th`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.tracks.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
               setTracks(( tracks ) => ([ ...tracks, {
                    track: {
                         uris: [track.uri],
                         position_ms: 0,
                         id: track.id,
                    },
                    id: track.id,
                    name: track.name,
                    image: track.album.images[2].url,
                    artist: track.artists.map((artist) => artist.name),
                    album: track.album.name,
                    duration: track.duration_ms,
                    explicit: track.explicit,
               }]))
          })

          const res = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          setArtist({
               id: res.data.id,
               name: res.data.name,
               cover: res.data.images[0].url,
          })

          const resp = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?country=th&limit=10`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          resp.data.items.map(( album ) => {
               setAlbums(( albums ) => ([ ...albums, {
                    id: album.id,
                    name: album.name,
                    image: album.images[1].url,
                    artist: album.artists.map(( artist ) => artist.name),
                    release: album.release_date.substring(0, 4),
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

     const chooseTrack = ( track ) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
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
          getArtist()
     }, [])

     return (
          <div className='artists'>
               <div className="header-info">
                    <img className='image-bg' src={ artist.cover }/>
                    <div className="playlists_banner">
                         <img className="album_cover" src={ artist.cover } alt='album_art'/>
                         <div className="album_info">
                              <p className="album_type">Artist</p>
                              <p className="album_name">{ artist.name }</p>
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
               <div className='album_search'>
                    <p className='search_title'>Top Tracks</p>
               </div>
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
                                   <div className='tr' key={val.id} onDoubleClick={() => {
                                        chooseTrack(val.track)
                                   }}>
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
                                   </div>
                              )
                         })}
                    </div>
               </div>
               <div className='album_search'>
                    <p className='search_title'>Albums</p>
                    <div className="search_album_row">
                         {albums?.map((val) => {
                              return (
                                   <NavLink key={val.id} to={`/me/album/?id=${val.id}`}>
                                        <div className='album_card'>
                                             <div className='cover'>
                                                  <img src={val.image} alt='cover'/>
                                             </div>
                                             <div className='name td'>{val.name}</div>
                                             <div className='artist td'>{val.artist.join(", ")}</div>
                                             <div className='release td'>{val.release}</div>
                                        </div>
                                   </NavLink>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
