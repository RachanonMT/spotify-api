import React, { useEffect, useState } from "react"
import { NavLink } from 'react-router-dom';
import axios from "axios";
import Nav from "./Nav"
import Search from "./Search";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from "../Utils/StateProvider";
import Player from "./Player";
import _Queue from '../Pages/_Queue'
import _CreatePlaylist from "../Pages/_CreatePlaylist";

export default function Home() {
     const [{ token, searchHistory, queue, playlist, toggleCreate }, dispatch]   = useStateProvider()
     const [search, setSearch]                    = useState('')
     const [input, setInput]                      = useState('')

     document.addEventListener('contextmenu', event => event.preventDefault());

     const getPlaylists = async () => {
          const response = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          });
          const playlist = response.data.items;
          dispatch({ type: reducerCases.SET_PLAYLIST, playlist })
     };

     useEffect(() => {
          setInput('')
     }, [window.location])

     useEffect(() => {
          const searchDelay = setTimeout(() => {
               const searchHistory = input
               setSearch(input)
               dispatch({ type: reducerCases.SET_SEARCH, searchHistory })
          }, 800)
      
          return () => clearTimeout(searchDelay)
     }, [input, dispatch, searchHistory])

     useEffect(() => {
          getPlaylists()
     }, [])


     return (
          <div className="container">
               <header className="header">
                    <div className="logo">
                         <i className="fa-brands fa-spotify logo-icon" />
                    </div>
                    <label htmlFor="search" className="search-frame">
                         <div className="search-box">
                         <i className="fa-solid fa-magnifying-glass"></i>
                         <input type="text" className="input-search" id="search" placeholder="What do you want to listen to?" autoComplete="off"
                              value={input}
                              onInput={(e) => {setInput(e.target.value)}}
                         />
                         </div>
                    </label>
                    <div className="profile">
                         <Profile/>
                    </div>
               </header>
               <article className="article">
                    <div className="sidebar">
                         <Navbar setSearch={setInput}/>
                    </div>
                    <div className="content">
                         {(search === '' ) && (<div>
                              <Nav/>
                         </div>)}
                         {(search !== '') && (<div>
                              <Search query={search} setSearch={setInput}/>
                         </div>)}
                    </div>
               </article>
               <Player/>
               <_Queue/>
               <_CreatePlaylist/>
          </div>
     )
}
