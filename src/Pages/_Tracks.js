import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'

export default function _Tracks() {
     const [{ token, currentPlaying }, dispatch] = useStateProvider()
     const [tracks, setTracks] = useState([])

     const getTracks = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          const { items } = response.data;
          items.map(( track ) => {
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

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
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
                         {tracks.map(val => {
                              return (
                                   <div className='tr' key={val.id} onClick={() => {
                                        chooseTrack(val.track)
                                   }}>
                                        <div className="cover td">
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
