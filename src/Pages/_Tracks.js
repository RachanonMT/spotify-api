import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'

export default function _Tracks() {
     const [{ token, currentPlaying, data }, dispatch]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])
     const [liked, setLiked]                      = useState([])
     const [dataTmp, setDataTmp]                  = useState(data)

     const getTracks = async () => {
          setSavedTrack([])
          const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          const { items } = response.data;
          items.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.track.id]))
               setTracks(( tracks ) => ([...tracks, {
                    track: {
                         uris: [track.track.uri],
                         position_ms: 0,
                         id: track.track.id,
                    },
                    id: track.track.id,
                    title: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artist: track.track.artists.map((artist) => artist.name),
                    explicit: track.track.explicit,
                    cover: track.track.album.images[2].url,
                    added: AddedDate(track.added_at),
                    duration: ConvertMs(track.track.duration_ms),
               }]))
          })
     };

     const unlikeTrack = async (id) => {
          await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          setDataTmp(( dataTmp ) => dataTmp = dataTmp + 1 )
          const data = dataTmp
          dispatch({ type: reducerCases.SET_DATA, data })
     }

     const getSaved = async () => {
          const id = savedTrack.join(",")
          const res = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          if(liked.length !== 0){
               for(let i=0; i<res.data.length; i++){
                    if(liked[i] != res.data[i]){
                         updateLike(i)
                    }
               }
          }else{
               res.data.map(( like ) => {
                    setLiked(( liked ) => ([...liked, like]))
               })
          }
     }

     const updateLike = ( idx ) => {
          const newLiked = [...liked];
          newLiked[ idx ] = !newLiked[ idx ]
          setLiked( newLiked )
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     const handleLike = (tmp, val, index) => {
          unlikeTrack(val)
          tracks.splice(index, 1)
     }

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [data])

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [tracks])

     useEffect(() => {
          if(savedTrack.length != 0)
          getSaved()
     }, [savedTrack])

     useEffect(() => {
          setSavedTrack([])
          setTracks([])
          setLiked([])
          getTracks();
     }, []);

     return (
          <div className='tracks'>
               <p className='title'>My Tracks</p>
               <div className='table'>
                    <div className='tr'>
                         <div className="cover th"></div>
                         <div className="title th">TITLE</div>
                         <div className="artist th">ARTIST</div>
                         <div className="album th">ALBUM</div>
                         <div className="added th">DATE ADDED</div>
                         <div className="time th">TIME</div>
                         <div className="track_btn th"></div>
                    </div>
                    <div className='table_body'>
                         {tracks.map(( val, i ) => {
                              return (
                                   <div className='tr' key={i} onDoubleClick={() => {
                                        chooseTrack(val.track)
                                   }}>
                                        <div className="cover td">
                                             <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                             <img src={val.cover} alt="cover"/>
                                        </div>
                                        <div className="title td">{val.title}
                                             {val.explicit === true &&
                                             <span className="explicit_tag">E</span>
                                             }
                                        </div>
                                        <div className="artist td">{val.artist.join(", ")}</div>
                                        <div className="album td">{val.album}</div>
                                        <div className="added td">{val.added}</div>
                                        <div className="time td">{val.duration}</div>
                                        <div className="track_btn td">
                                             <i className="fa-solid fa-ellipsis"/>
                                             <i className="fa-solid fa-plus"/>
                                             <i className={liked[i]? "fa-solid fa-heart hearted":"fa-regular fa-heart"} onClick={() => {
                                                  handleLike(liked[i], val.id, i)
                                             }} />
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
