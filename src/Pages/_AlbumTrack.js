import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import _ListTrack from './_ListTrack'
import { LazyLoadImage } from 'react-lazy-load-image-component'


export default function _AlbumTrack() {
     const albumId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [albums, setAlbums]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [duration, setDuration]                = useState(0)

     const getAlbums = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          setAlbums({
               id: res.data.id,
               name: res.data.name,
               cover: res.data.images[0].url,
               release: res.data.release_date.substring(0,4),
               total: res.data.total_tracks,
               type: res.data.type.toUpperCase(),
               artist: res.data.artists?.map((val) => ({
                    id: val.id,
                    name: val.name,
               }))
          })

          const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          setTracks([])
          items.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
               setDuration(( duration ) => duration + track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    album: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": track.track_number-1
                         },
                         "position_ms": 0,
                         id: track.id,
                    },
                    image: res.data.images[2].url,
                    no: track.track_number,
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map(( artist ) => artist.name),
                    artistId: track.artists.map(( artist ) => artist.id),
                    duration: ConvertMs(track.duration_ms, 0),
                    explicit: track.explicit,
                    uri: track.uri,
                    url: track.external_urls.spotify,
               }]))
          })
     };

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getAlbums()
     }, [])

     return (
          <div className='albums'>
               <div className="header-info">
                    <LazyLoadImage effect="blur" className='image-bg' src={albums.cover} loading="lazy"/>
                    <div className="playlists_banner">
                         <LazyLoadImage effect="blur" className="album_cover" src={ albums.cover } loading="lazy"/>
                         <div className="album_info">
                              <p className="album_type">{ albums.type }</p>
                              <p className="album_name">{ albums.name }</p>
                              <p className="album_artist">
                                   {albums.artist?.map(( artist, index ) => {
                                        return <span key={ index }>{ artist.name } </span>
                                   })}
                              </p>
                              <p className="album_track_total">
                                   <span>{ albums.total } Tracks &nbsp; | &nbsp; {ConvertMs( duration, 1 )}</span>
                              </p>
                              <p className='album_release'>{ albums.release }</p>
                         </div>
                    </div>
                    <div className="album_control">
                         <button className="album_play_btn" onClick={() => {chooseTrack( tracks[0].album )}}>
                              <div className="inside_btn">
                                   <i className="fa-solid fa-play"></i>
                                   Play
                              </div>
                         </button>
                    </div>
               </div>
               <_ListTrack tracks={tracks} savedTrack={savedTrack} type={1} />
          </div>
     )
}
