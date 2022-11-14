import axios from 'axios'
import { useEffect, useState } from 'react'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'

export default function _Home() {
     const [{ token, currentPlaying }, dispatch] = useStateProvider()
     const [tracks, setTracks] = useState([])
     const [seeds, setSeeds] = useState([])

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
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

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
                    <div className='tr'>
                         <div className="cover th"></div>
                         <div className="title th">TITLE</div>
                         <div className="artist th">ARTIST</div>
                         <div className="album th">ALBUM</div>
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
          </div>
     )
}
