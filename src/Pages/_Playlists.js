import { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Utils/StateProvider'
import { NavLink } from 'react-router-dom'


export default function _Playlists() {
     const [{ token, toggleCreate }] = useStateProvider()
     const [playlists, setPlaylists] = useState([]) 

     const getPlaylists = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const { items } = response.data;
          setPlaylists([])
          items.map(( playlist ) => {
               setPlaylists(playlists => ([...playlists, {
                    id: playlist.id,
                    name: playlist.name,
                    cover: playlist.images[0]?.url,
                    added: playlist.added_at,
                    tracks_url: playlist.tracks.href,
                    track_total: playlist.tracks.total,
                    owner: playlist.owner.display_name,
                    public: playlist.public,

               }]))
          })
     };

     useEffect(() => {
          getPlaylists()
     }, [toggleCreate])

     useEffect(() => {
          getPlaylists()
     }, [])

     return (
          <div>
               <p className='title'>My Playlists</p>
               <div className='show_playlists'>
                    {playlists.map((val) => {
                         return (
                              <NavLink className='playlist' key={val.id} to={`/me/playlist/?id=${val.id}`}>
                                   <div className='playlist_image'>
                                        <img src={val.cover} alt='cover'/>
                                   </div>
                                   <p className='playlist_name'>{val.name}</p>
                                   <p className='create_by'>By {val.owner}</p>
                                   <p className='tracks_number'>{val.track_total} Tracks</p>
                              </NavLink>
                         )
                    })}
               </div>
          </div>
     )
}
