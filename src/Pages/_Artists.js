import { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Auth/StateProvider'
import { NavLink } from 'react-router-dom'

export default function _Artists() {
     const [{ token }] = useStateProvider()
     const [ artist, setArtist ] = useState([])

     const getArtists= async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/following?type=artist&limit=50`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          response.data.artists.items.map(( artists ) => {
               setArtist(( artist ) => ([ ...artist, {
                    id: artists.id,
                    name: artists.name,
                    image: artists.images[1].url,
               }]))
          })
     };

     useEffect(() => {
          getArtists()
     }, [])

     return (
          <div>
               <p className='title'>My Artists</p>
               <div className='show_artist'>
                    {artist.map((val) => {
                         return (
                              <div className='playlist' key={val.id}>
                                   <NavLink to={`/me/artist/?id=${val.id}`}>
                                        <div  className='playlist_image'>     
                                             <img src={val.image} alt='cover'/>
                                        </div>
                                   </NavLink>
                                   <p className='playlist_name'>{val.name} </p>
                              </div>
                         )
                    })}
               </div>
          </div>
     )
}
