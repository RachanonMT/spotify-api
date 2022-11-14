import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'

export default function _ArtistTrack() {
     const artistId = new URLSearchParams( window.location.search).get("id" )
     const [{ token, currentPlaying }, dispatch ] = useStateProvider()
     const [ artist, setArtist ] = useState([])
     const [ tracks, setTracks ] = useState([])
     const [ albums, setAlbums ] = useState([])

     const getArtist = async () => {
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

          const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=th`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.tracks.map(( track ) => {
               setTracks(( tracks ) => ([ ...tracks, {
                    track: {
                         uris: [track.uri],
                         position_ms: 0,
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

     const chooseTrack = ( track ) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getArtist()
     }, [])


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
                         {tracks.map(val => {
                              return (
                                   <div className='tr' key={val.id} onClick={() => {
                                        chooseTrack(val.track)
                                   }}>
                                        <div className="cover td">
                                             <img src={val.image} alt="cover"/>
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
                                             <i className="fa-solid fa-heart hearted"/>
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
