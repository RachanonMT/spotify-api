import React from 'react'
import { NavLink } from 'react-router-dom'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from "../Utils/StateProvider";

export default function Navbar({setSearch}) {
     const [{ toggleCreate }, dispatch]   = useStateProvider()
     return (
          <div className='navbar'>
               <p className='nav-title'>BROWSE</p>
               <NavLink to={"/"} onClick={() => {setSearch('')}} className={({ isActive }) => isActive ? ('activeLink nav_link'): 'nav_link'}>
                    Home
               </NavLink>
               <hr className='group'/>
               <p className='nav-title'>MY LIBRARY</p>
               <NavLink to={"/me/collection/tracks"} onClick={() => {setSearch('')}} className={({ isActive }) => isActive ? ('activeLink nav_link'): 'nav_link'}>
                    Tracks
               </NavLink>
               <NavLink to={"/me/playlists"} onClick={() => {setSearch('')}} className={({ isActive }) => isActive ? ('activeLink nav_link'): 'nav_link'} >
                    Playlists
               </NavLink>
               <NavLink to={"/me/albums"} onClick={() => {setSearch('')}} className={({ isActive }) => isActive ? ('activeLink nav_link'): 'nav_link'} >
                    Albums
               </NavLink>
               <NavLink to={"/me/artists"} onClick={() => {setSearch('')}} className={({ isActive }) => isActive ? ('activeLink nav_link'): 'nav_link'} >
                    Artists
               </NavLink>
               <hr className='group'/>
               <p className='nav-title'>MY PLAYLISTS</p>
               <NavLink onClick={() => {setSearch(''); const toggleCreate = true; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}} className='nav_link' >
                    Create Playlist
               </NavLink>
          </div>
     )
}
