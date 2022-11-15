import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar({setSearch}) {
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
     </div>
  )
}
