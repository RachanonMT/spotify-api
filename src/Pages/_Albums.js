import { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Auth/StateProvider'
import { NavLink } from 'react-router-dom'

export default function _Albums() {
     const [{ token }] = useStateProvider()
     const [albums, setAlums] = useState([])
     
     const getAlbums = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/albums`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          items.map(( album ) => {
               setAlums(albums => ([...albums, {
                    id: album.album.id,
                    name: album.album.name,
                    cover: album.album.images[0]?.url,
                    artists: album.album.artists.map(( artist ) => ({
                         id: artist.id,
                         name: artist.name
                    })),
                    release_date: album.album.release_date.substring(0,4),
                    tracks_url: album.album.tracks.href,
                    track_total: album.album.total_tracks,
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
               <div className='show_playlists'>
                    {albums.map((val) => {
                         return (
                              <NavLink className='playlist' key={val.id} to={`/me/album/?id=${val.id}`}>
                                   <div className='playlist_image'>
                                        <img src={val.cover} alt='cover'/>
                                   </div>
                                   <p className='playlist_name'>{val.name}</p>
                                   <p className='create_by'>{val.artists?.map(( val, i ) => {
                                        return <span key={i}>{val.name}</span>
                                   })}</p>
                                   <p className='tracks_number'>{val.release_date}</p>
                              </NavLink>
                         )
                    })}
               </div>
          </div>
     )
}
