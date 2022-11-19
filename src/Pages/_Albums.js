import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import { NavLink, useNavigate } from 'react-router-dom'
import _ListCard from './_ListCard'

export default function _Albums() {
     const [{ token, playlist }, dispatch] = useStateProvider()
     const [albums, setAlums] = useState([])
     const [albumUri, setAlbumUri] = useState([])
     const [savedAlbum, setSavedAlbum] = useState([])
     
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
               setSavedAlbum(( savedAlbum ) => ([...savedAlbum, album.album.id]))
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

     

     useEffect(() => {
          getAlbums()
     }, [])

     return (
          <div>
               <p className='title'>My Albums</p>
               <_ListCard card={albums} uri={albumUri} savedAlbum={savedAlbum} type={0} />
          </div>
     )
}
