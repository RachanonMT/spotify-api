import React, { useEffect } from "react";
import Home from './Home'
import Login from './Login'
import '../Styles/styles.css'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'
import { Route, Routes, BrowserRouter } from "react-router-dom";

export default function App() {
     const [{ token, deviceId, device}, dispatch] = useStateProvider()

     useEffect(() => {
          const hash = window.location.hash;
          if (hash) {
               const token = hash.substring(1).split("&")[0].split("=")[1];
               if (token) {
                    dispatch({ type: reducerCases.SET_TOKEN, token });
                    const script = document.createElement("script")
                    if(!deviceId){
                         script.src = "https://sdk.scdn.co/spotify-player.js"
                         script.async = true
                         
                         document.body.appendChild(script);
                         
                         window.onSpotifyWebPlaybackSDKReady = () => {
                         
                              const device = new window.Spotify.Player({
                                   name: 'Web Player',
                                   getOAuthToken: cb => { cb(token); },
                                   volume: 0.5
                              });
                         
                              device.addListener('ready', ({ device_id }) => {
                                   const deviceId = device_id
                                   if (deviceId) {
                                        dispatch({ type: reducerCases.SET_PLAYER, deviceId })
                                   }
                              });
                         
                              device.addListener('not_ready', () => {
                                   console.log('Device gone offline');
                              });
                              
                              device.connect();
                              dispatch({ type: reducerCases.SET_DEVICE, device });
                         }
                    }
               }
          }
          document.title = "Spotify"
     }, [])
     return (
          <BrowserRouter>
               <Routes>
                    <Route path="/*" element={token? <Home/> :<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
               </Routes>
          </BrowserRouter>
     )

}
