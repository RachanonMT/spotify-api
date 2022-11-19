import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import _ListTrack from './_ListTrack'

export default function _PlaylistTrack() {
     const playlistId = new URLSearchParams(window.location.search).get("id")
     const [{ token, currentPlaying}, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [playlists, setPlaylists]              = useState([])
     const [duration, setDuration]                = useState(0)

     const getPlaylists = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          setPlaylists({
               id: res.data.id,
               name: res.data.name,
               owner: res.data.owner.display_name,
               cover: res.data.images[0].url,
               total: res.data.tracks.total,
               type: res.data.type.toUpperCase(),
               public: (res.data.public)? "PUBLIC":"PRIVATE",
          })

          const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          var num = 1
          items.map(( track, index ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.track.id]))
               setDuration(( duration ) => duration + track.track.duration_ms)
               setTracks(tracks => ([...tracks, {
                    playlist: {
                         "context_uri": res.data.uri,
                         "offset": {
                              "position": index
                         },
                         "position_ms": 0,
                         id: track.track.id,
                    },
                    no: num++,
                    id: track.track.id,
                    cover: track.track.album.images[2].url,
                    name: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artists: track.track.artists.map(( artist ) => artist.name),
                    artistId: track.track.artists.map(( artist ) => artist.id),
                    duration: ConvertMs(track.track.duration_ms, 0),
                    explicit: track.explicit,
                    added: track.added_at,
                    uri: track.track.uri,
                    url: track.track.external_urls.spotify,
               }]))
          })
     };

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getPlaylists()
     }, [])

     return (
          <div className='playlists'>
               <div className="header-info">
                    <LazyLoadImage effect='blur' className='image-bg' src={ playlists.cover }/>
                    <div className="playlists_banner">
                         <LazyLoadImage effect='blur' className="album_cover" src={ playlists.cover }/>
                         <div className="album_info">
                              <p className="album_type">{ playlists.public }&nbsp; &nbsp;{ playlists.type }</p>
                              <p className="album_name">{ playlists.name }</p>
                              <p className="playlist_owner">Created By { playlists.owner }</p>
                              <p className="album_track_total">
                                   <span>{ playlists.total } Tracks &nbsp; | &nbsp; { ConvertMs( duration, 1 ) }</span>
                              </p>
                         </div>
                    </div>
                    <div className="album_control">
                         <button className="album_play_btn" onClick={() => {chooseTrack(tracks[0].playlist)}}>
                              <div className="inside_btn">
                                   <i className="fa-solid fa-play"></i>
                                   Play
                              </div>
                         </button>
                    </div>
               </div>
               <_ListTrack tracks={tracks} savedTrack={savedTrack} type={3} setTracks={setTracks}/>
          </div>
     )
}
