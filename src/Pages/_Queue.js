import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'

export default function _Queue(props) {
     const [{ token, state, nowPlaying, device, currentPlaying }, dispatch] = useStateProvider()
     const [inQueue, setQueue] = useState([])
     const [playing, setPlaying] = useState([])
     
     const _hideQueue = (ref) => {
          useEffect(() => {
               const handleClickOutside = (event) => {
                    function check() {
                         let tmp = 0
                         event.path.map((val) => {
                              if(val.className === "player"){
                                   tmp++
                              }
                         })
                         if(tmp == 0)
                              return true
                         else
                              return false
                    }
                    if (ref.current && !ref.current.contains(event.target) && check() ) {
                         const queue = false
                         dispatch({ type: reducerCases.SET_QUEUE, queue })
                    }
               }
               document.addEventListener("mousedown", handleClickOutside);
               return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
               };
          }, [ref]);
     }

     const wrapRef = useRef(null);
     _hideQueue(wrapRef);

     const getQueue = async () => {
          setQueue([])
          const res = await axios.get(`https://api.spotify.com/v1/me/player/queue`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          res.data.queue.map(( queue, index ) => {
               setQueue(( inQueue ) => ([...inQueue, {
                    track: {
                         uris: res.data.queue.map(( track ) => track.uri),
                         position_ms: 0,
                         "offset": {
                              "uri": queue.uri
                         },
                         id: queue.id,
                    },
                    id: queue.id,
                    name: queue.name,
                    artist: queue.artists.map(( artist ) => artist.name),
                    image: queue.album.images[2].url,
                    explicit: queue.explicit,
               }]))
          })
          setPlaying({
               track: {
                    uris: [res.data.currently_playing.uri],
                    position_ms: 0,
                    id: res.data.currently_playing.id,
               },
               id: res.data.currently_playing.id,
               name: res.data.currently_playing.name,
               artist: res.data.currently_playing.artists.map(( artist ) => artist.name),
               image: res.data.currently_playing.album.images[2].url,
               explicit: res.data.currently_playing.explicit,
          })
     }

     const chooseTrack = (track) => {
          const currentPlaying = track
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying })
     }

     useEffect(() => {
          device.getCurrentState().then(state => {
               if (!state) {
                 return;
               }
          });
     }, [state])

     useEffect(() => {
          getQueue()
     }, [nowPlaying])

     return (
          <div className='queue_show' ref={wrapRef}>
               <p className='queue-title'>NOW PLAYING</p>
               {playing.length != 0 && <div className='queue-track'>
                    <div className='image relative now-playing'>
                         <div className="playing">
                              <div className={state ? ('box1 pause'): 'box1'} id={playing.length != 0 ?(""):("hide")}></div>
                              <div className={state ? ('box2 pause'): 'box2'} id={playing.length != 0 ?(""):("hide")}></div>
                              <div className={state ? ('box3 pause'): 'box3'} id={playing.length != 0 ?(""):("hide")}></div>
                         </div>
                         <img src={playing.image} />
                    </div>
                    <div className='queue-info'>
                         <p className='queue-name highlight'>{playing.name}</p>
                         <span className='queue-artist'>{playing.artist}</span>
                    </div>
               </div>}
               {inQueue.length != 0 && (<p className='queue-title'>NEXT UP</p>

               )}     
               {inQueue?.map(( val, i ) => {
                    return (
                         <div className='queue-track' key={i} onDoubleClick={() => {chooseTrack(val.track)}}>
                              <div className='image relative'>
                                   <i className="fa-solid fa-play play-track" onClick={() => {chooseTrack(val.track)}}/>
                                   <img src={val.image} />
                              </div>
                              <div className='queue-info'>
                                   <p className='queue-name'>{val.name}</p>
                                   <span className='queue-artist'>{val.artist}</span>
                              </div>
                         </div>
                    )
               })}
          </div>
     );
}

