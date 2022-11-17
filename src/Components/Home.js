import React, { useEffect, useState } from "react"
import { NavLink } from 'react-router-dom';
import Nav from "./Nav"
import Search from "./Search";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { reducerCases } from "../Auth/Const"
import { useStateProvider } from "../Auth/StateProvider";
import Player from "./Player";

export default function Home() {
     const [{ searchHistory }, dispatch]          = useStateProvider()
     const [search, setSearch]                    = useState('')
     const [input, setInput]                      = useState('')

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

     return (
          <div className="container">
               <header className="header">
                    <div className="logo">
                    </div>
                    <label htmlFor="search" className="search-frame">
                         <div className="search-box">
                         <i className="fa-solid fa-magnifying-glass"></i>
                         <input type="text" id="search" placeholder="What do you want to listen to?" autoComplete="off"
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
          </div>
     )
}
