import axios from 'axios'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'

export default function _Home() {
     const [{ token, currentPlaying }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])     
     const [albums, setAlbums]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [seeds, setSeeds]                      = useState([])
     const [data, setData]                        = useState(0)

     const getSeeds = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=5`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          setSeeds({
               seeds: response.data.items.map(( seed ) => seed.id)
          })
     }
     
     const getRecommend = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${seeds.seeds.join(",")}&limit=5`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          res.data.tracks.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
               setTracks(( tracks ) => ([...tracks, {
                    track: {
                         uris: [track.uri],
                         position_ms: 0,
                         id: track.id,
                    },
                    id: track.id,
                    name: track.name,
                    album: track.album.name,
                    album_id: track.album.id,
                    artist: track.artists.map((artist) => artist.name),
                    explicit: track.explicit,
                    image: track.album.images[2].url,
                    duration: ConvertMs(track.duration_ms),
               }]))
          })

          const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          response.data.albums.items.map(( album ) => {
               setAlbums(( albums ) => ([...albums, {
                    id: album.id,
                    name: album.name,
                    artist: album.artists.map(( artist ) => artist.name),
                    image: album.images[1].url,
                    release: album.release_date.substring(0, 4)
               }]))
          })
     }
    
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

     const likeTrack = async (id) => {
          await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    ids: [
                         `${id}`
                    ]
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          setData(( data ) => data = data + 1)
     }

     const unlikeTrack = async (id) => {
          await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          setData(( data ) => data = data + 1)
     }

     const handleLike = (val, id, index) => {
          if(val == true){
               unlikeTrack(id)
               liked[index] = false
          }else{
               likeTrack(id)
               liked[index] = true
          }
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          getSaved()
     }, [data])

     useEffect(() => {
          getSaved()
     }, [savedTrack])

     useEffect(() => {
          getSeeds()
     }, [])

     useEffect(() => {
          getRecommend()
     }, [seeds])

     return (
          <div className='tracks'>
               <p className='title'>For You</p>
               <div className='table'>
                    <div className='table_body'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr' key={val.id} onDoubleClick={() => {
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
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"} onClick={
                                                  () => {handleLike(liked[i], val.id, i)}
                                             }/>
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
               </div>
               <div className='album_search'>
                    <p className='search_title'>New Releases</p>
                    <div className="search_album_row">
                         {albums?.map((val) => {
                              return (
                                   <NavLink key={val.id} to={`/me/album/?id=${val.id}`}>
                                        <div className='album_card'>
                                             <div className='cover'>
                                                  <img src={val.image} alt='cover'/>
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
          </div>
     )
}
