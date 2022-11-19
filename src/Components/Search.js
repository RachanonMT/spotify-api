import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function Search({query, setSearch}) {
     const [{ token, currentPlaying }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [albums, setAlbums]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [artists, setArtists]                  = useState([])

     const getTracks = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.tracks.items?.map((track) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
               setTracks(tracks => ([...tracks, {
                    track: {
                         uris: [track.uri],
                         position_ms: 0,
                         id: track.id,
                    },
                    id: track.id,
                    name: track.name,
                    cover: track.album.images[0]?.url,
                    artist: track.artists?.map((val) => ({
                         id: val.id,
                         name: val.name,
                    })),
                    explicit: track.explicit,
                    duration: ConvertMs(track.duration_ms)
               }]))
          })
     };

     const getAlbums = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.albums.items?.map((album) => {
               setAlbums(albums => ([...albums, {
                    id: album.id,
                    name: album.name,
                    cover: album.images[1]?.url,
                    artist: album.artists?.map((val) => ({
                         id: val.id,
                         name: val.name,
                    })),
                    release: album.release_date.substr(0, 4),
                    total: album.total_tracks,
               }]))
          })
     };

     const getArtists = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.artists.items?.map((artist) => {
               setArtists(artists => ([...artists, {
                    id: artist.id,
                    name: artist.name,
                    cover: artist.images[0]?.url,
                    type: artist.type.toUpperCase(),
               }]))
          })
     };

     const getSaved = async () => {
          const id = savedTrack.join(",")
          const res = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          res.data.map(( like ) => {
               setLiked(( liked ) => ([...liked, like]))
          })
     }

     const handleClick = () => {
          setSearch('')
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getSaved()
     }, [savedTrack])

     useEffect(() => {
          setLiked([])
          setTracks([])
          setAlbums([])
          setArtists([])
          setSavedTrack([])
          getTracks()
          getAlbums()
          getArtists()
     }, [query])

     return (
          <div className='show_search'>
               <div className="top_search">
                    <div className="card_top_result">
                         <p className='search_title'>Top Result</p>
                         <NavLink to={"/me/artist?id="+artists[0]?.id} onClick={() => {handleClick()}}>
                              <div className='top_result'>
                                   <div className="img"><img src={artists[0]?.cover}/></div>
                                   <p className='top_artist'>{artists[0]?.name}</p>
                                   <p className='top_type'>{artists[0]?.type}</p>
                              </div>
                         </NavLink>
                    </div>
                    <div className='search_track'>
                         <p className='search_title'>Tracks</p>
                         <div className='search_track_row'>
                              {tracks.map(( val, i ) => {
                                   return (
                                        <div className='tr' key={val.id} onClick={() => {chooseTrack(val.track)}}>
                                             <div className="cover td relative">
                                                  <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                                  <img src={val.cover} alt="cover"/>
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
                                        </div>
                                   )
                              })}
                         </div>
                    </div>
               </div>
               <div className='album_search'>
                    <p className='search_title'>Albums</p>
                    <div className="search_album_row">
                         {albums?.map((val) => {
                              return (
                                   <NavLink key={val.id} to={`/me/album/?id=${val.id}`} onClick={() => {handleClick()}}>
                                        <div className='album_card'>
                                             <div className='cover'>
                                                  <img src={val.cover} alt='cover'/>
                                             </div>
                                             <div className='name td'>{val.name}</div>
                                             <div className='artist td'>{val.artist[0]?.name}</div>
                                             <div className='release td'>{val.release}</div>
                                        </div>
                                   </NavLink>
                              )
                         })}
                    </div>
               </div>
               <div className='artist_search'>
                    <div className='search_title'>Artists</div>
                    <div className="search_artist_row">
                         {artists?.map((val) => {
                              return (
                                   <NavLink key={val.id} to={"/me/artist?id="+val?.id} onClick={() => {handleClick()}}>
                                        <div className='artist_card'>
                                             <div className='cover'>
                                                  <img src={val.cover} alt='cover'/>
                                             </div>
                                             <div className='name td'>{val.name}</div>
                                        </div>
                                   </NavLink>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
