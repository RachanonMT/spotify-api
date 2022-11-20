import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { NavLink } from 'react-router-dom'
import _ListTrack from '../Pages/_ListTrack'

export default function Search({query, setSearch}) {
     
     const [{ token, currentPlaying }]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [albums, setAlbums]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
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
                    image: track.album.images[0]?.url,
                    artist: track.artists.map((artist) => artist.name),
                    artistId: track.artists.map(( artist ) => artist.id),
                    explicit: track.explicit,
                    duration: ConvertMs(track.duration_ms),
                    uri: track.uri,
                    url: track.external_urls.spotify,
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


     const handleClick = () => {
          setSearch('')
     }

     useEffect(() => {
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
                    <_ListTrack tracks={tracks} savedTrack={savedTrack} type={5}/>
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
