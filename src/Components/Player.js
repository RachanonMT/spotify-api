import { useEffect, useState } from 'react'
import axios from 'axios'
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from '../Auth/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'

export default function Player() {
     const [{ token, deviceId, currentPlaying, device }, dispatch] = useStateProvider()
     const [paused, setPaused] = useState(true)
     const [time, setTime] = useState(0)
     const [tmp, setTmp] = useState(0)
     const [inputTime, setInputTime] = useState(false)
     const [volume, setVolume] = useState(0)
     const [inputVol, setInputVol] = useState(false)
     const [vol, setVol] = useState(0)
     const [availableDevice, setAvailableDevice] = useState([])
     const [openDevice, setOpenDevice] = useState(false)
     const [trackInfo, setTrackInfo] = useState({
          status: false,
          name: '',
          cover: '',
          artist: [{}],
          duration: 0,
     })

     const [check, setCheck] = useState("")

     const playTrack =  async () => {
          await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, 
               currentPlaying,    
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
               }
          })
          setPaused(false)
          setTime(parseInt(currentPlaying.position_ms)/1000)
     }

     const handlePause = () => {
          device.getCurrentState().then( state => { 
               setTime(state.position)
               setVolume(device._options.volume * 100)
               setPaused(state.paused)
               setTrackInfo({
                    status: true,
                    name: state.track_window.current_track.name,
                    cover: state.track_window.current_track.album.images[2].url,
                    artist: state.track_window.current_track.artists.map((val) => ({
                         name: val.name,
                         url: val.url
                    })),
                    duration: state.track_window.current_track.duration_ms,
               })
          })
     }

     const seekTime = (val) => {
          playPosition(val)
     }

     const seekVolume = (val) => {
          playVolume(val)
     }

     const playPosition =  async (val) => {
          await axios.put(`https://api.spotify.com/v1/me/player/seek?device_id=${deviceId}&position_ms=${val}`, 
               {
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
               }
          })
     }

     const playVolume =  async (val) => {
          await axios.put(`     https://api.spotify.com/v1/me/player/volume?device_id=${deviceId}&volume_percent=${val}`, 
               {
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
               }
          })
     }

     const getDevice = async () => {
          setCheck("")
          const res = await axios.get(`https://api.spotify.com/v1/me/player/devices`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               }
          })
          setAvailableDevice([])
          res.data.devices.map(( val ) => {
               if(val.is_active == false) {
                    setCheck("Device")
               }
               setAvailableDevice(( availableDevice ) => ([...availableDevice, {
                    id: val.id,
                    is_active: val.is_active,
                    is_restricted: val.is_restricted,
                    name: val.name,
                    type: val.type,
                    volume: val.volume_percent,
                    thisDevice: (val.id == deviceId)?true:false,
               }]))
          })
     }

     const transferDevice = async (val) => {
          const res = await axios.put(`https://api.spotify.com/v1/me/player`,
               {
                    "device_ids": [
                         val
                    ]
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
               }
          })
     }

     const handleTransfer = (val) => {
          transferDevice(val)
     }

     const handleDevice = () => {
          if(openDevice == false){
               getDevice()
               setOpenDevice(true)
          }else{
               setOpenDevice(false)
          }
     } 

     window.addEventListener("click", (event) => {
          const Element = document.querySelector(".speaker");
          if (event.target.className != Element.className) {
               if(openDevice == true){
                    setOpenDevice(false)
               }
          } 
     });

     useEffect(() => {
          if(currentPlaying !== null){
               setInterval(() => {
                    handlePause()
               }, 1000);
          }
     }, [currentPlaying])

     useEffect(() => {
          setAvailableDevice([])
          setOpenDevice(false)
     }, [])

     useEffect(() => {
          playTrack()
     }, [currentPlaying])

     // const slider = document.getElementById("volume");
     // if(slider != null){
     // slider.addEventListener("wheel", function(e){
     //      if (e.deltaY < 0){
     //           if(slider.valueAsNumber < 100){
     //                slider.value = volume + 5;
     //                // seekVolume(slider.valueAsNumber)
     //                setVol(slider.valueAsNumber)
     //                setVolume(slider.valueAsNumber)
     //           }else{
     //                console.log(slider.value, vol);
     //           }
     //      }
     //      if(e.deltaY > 0){
     //           if(slider.value > 0){
     //                setVolume(slider.valueAsNumber - 5)
     //                setVol(slider.valueAsNumber)
     //                console.log("Down", slider.valueAsNumber, vol);
     //                slider.value = volume - 5;
     //           }
     //      }
     //      e.preventDefault();
     //      e.stopPropagation();
     // })}

     return (
          <div className="player">
               <div className='playback-info'>
                    <div className='playback-cover'>
                         <img src={trackInfo.cover} alt=''/>
                    </div>
                    <div className='playback-name'>
                         <p className='name'>{trackInfo.name}{trackInfo.status?<i className="fa-solid fa-heart hearted"/>:""}</p>
                         <p className='artist'>{trackInfo.artist[0].name}</p>
                         <p className='from'>{trackInfo.status?'PLAYING FROM : TRACKS':""}</p>
                    </div>    
               </div>

               <div className='playback-control justify-around'>
                    <div className='flex center'>
                         <button className="btn-previous" onClick={() => { 
                              device.previousTrack() 
                         }}>
                              <i className="fa-solid fa-backward-step"></i>
                         </button>
                         <button className="btn-play" onClick={() => { 
                                   device.togglePlay() 
                                   handlePause()
                                   }} >
                              {!paused ?<i className="fa-solid fa-pause"></i>:<i className="fa-solid fa-caret-right"></i> }
                         </button>
                         <button className="btn-next" onClick={() => { 
                              device.nextTrack() 
                         }}>
                              <i className="fa-solid fa-forward-step"></i>
                         </button>
                    </div>
                    <div className='flex justify-around center'>
                         <span className='time-start'>{("" + Math.floor(((inputTime?tmp:time) / 60000) % 60)).slice(-2)+":"+("0" + Math.floor(((inputTime?tmp:time) / 1000) % 60)).slice(-2)}</span>
                         <div className="progress-bar">
                              <input type="range" id='input_time' value={inputTime?tmp:time}  min={0} max={trackInfo?trackInfo.duration:100} 
                                   onMouseUp={(e) => {
                                        seekTime(e.target.value)
                                        setInputTime(false)
                                        }
                                   }
                                   onInput={(e) => {
                                        setTmp(e.target.value)
                                        setTime(e.target.value)
                                   }}
                                   onMouseDown={() => {
                                        setInputTime(true)
                                   }}
                              ></input>
                              <progress min={0} value={inputTime?tmp:time} max={trackInfo?trackInfo.duration:100}/>
                         </div>
                         <span className='time-end'>{trackInfo?ConvertMs(trackInfo.duration):"0:00"}</span>
                    </div>
               </div>

               <div className='playback-device'>
                    <div></div>
                    <div className='device flex'>
                         <i className="fa-solid fa-sort-up full"></i>
                         <i className="fa-solid fa-bars queue"></i>
                         <i className="speaker bi bi-speaker-fill" onClick={() => {handleDevice()}}></i>
                         {openDevice == true && (<div className='device-show'>
                              {availableDevice.map(( val ) => {
                                   if(val.is_active == true){
                                        val = 0
                                        return <p className='device-title'>Current Device</p>
                                   }
                              })}
                              {availableDevice.map(( val ) => {
                                   if(val.is_active == true){
                                        return (
                                             <div onClick={() => {handleTransfer(val.id)}}>
                                                  <p className={val.is_active==true? ('device-name active-device'): 'device-name'}>{val.id == deviceId?"This ":""}{val.name}</p>
                                             </div>
                                        )
                                   }
                                   
                              })}
                              {/* {( ) => {
                                   if(this.check == 1){
                                        return <p className='device-title'>{check}</p>
                                        this.check = 0
                                   }
                              }} */}
                              <p className='device-title'>{check}</p>
                              {availableDevice.map(( val ) => {
                                   if(val.is_active == false){
                                        return (
                                             <div onClick={() => {handleTransfer(val.id)}}>
                                                  <p className={val.is_active==true? ('device-name active-device'): 'device-name'}>{val.id == deviceId?"This ":""}{val.name}</p>
                                             </div>
                                        )
                                   }
                                   
                              })}
                         </div>)}
                    </div>
                    <div className='volume-device'>
                         <i className="fa-solid fa-volume-low"></i>
                              <input type='range' id='volume' className='volume-input' min='0' max='100' value={inputVol?vol:volume}
                                   onMouseUp={(e) => {
                                        setInputTime(false)
                                   }}
                                   onInput={(e) => {
                                        seekVolume(e.target.value)
                                        setVol(e.target.value)
                                        setVolume(e.target.value)
                                   }}
                                   onMouseDown={() => {
                                        setInputVol(true)
                                   }}
                                   onMouseOver={(e) => {
                                        setInputTime(true)
                                        adjustVolume(e)
                                   }}
                                   onMouseLeave={() => {
                                        setInputTime(false)
                                   }}
                              ></input>
                              <progress className='volume-output' min='0' max='100' value={inputVol?vol:volume}></progress>
                    </div>
               </div>
          </div>
     )
}
