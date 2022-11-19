import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Utils/StateProvider'
import { NavLink } from 'react-router-dom'
import _ListTrack from './_ListTrack'

export default function _ArtistTrack() {
     const artistId = new URLSearchParams( window.location.search).get("id" )
     const [{ token, currentPlaying }]  = useStateProvider()
     const [ artist, setArtist ]                  = useState([])
     const [ tracks, setTracks ]                  = useState([])
     const [ albums, setAlbums ]                  = useState([])
     const [savedTrack, setSavedTrack]            = useState([])

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
                    artistId: track.artists.map(( artist ) => artist.id),
                    album: track.album.name,
                    duration: track.duration_ms,
                    explicit: track.explicit,
                    uri: track.uri,
                    url: track.external_urls.spotify,
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
               <_ListTrack tracks={tracks} savedTrack={savedTrack} type={2} />
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
