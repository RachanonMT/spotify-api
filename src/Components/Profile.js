import axios from 'axios'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from '../Utils/StateProvider'

export default function Profile() {
     const [{ token, device, userId }, dispatch] = useStateProvider()
     const [user, setUser] = useState([])
     const [profile, setProfile] = useState(false)

     const getUser = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/me`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               }
          })
          setUser({
               image: res.data.images[0].url,
               name: res.data.display_name,
          })
          const userId = res.data.id
          dispatch({ type: reducerCases.SET_USER, userId })
     }

     const handleLogout = () => {
          device.disconnect()
     }

     const handleProfile = () => {
          if(profile){
               setProfile(false)
          }else{
               setProfile(true)
          }
     }

     window.addEventListener("click", (event) => {
          if (event.target.className != profile_btn.className && event.target.className != 'find') {
               if(profile == true){
                    setProfile(false)
               }
          } 
     });

     useEffect(() => {
          getUser()
     }, [])
     
     return (
          <div className='find'>
               <div className='profile_btn' id='profile_btn' onClick={() => {handleProfile()}}>
                    <img className='find' src={user.image} alt='user'/>
               </div>
               {(profile === true) && (<div className='logout'> 
                    <p className='user-name'>{user.name}</p>    
                    <NavLink to="/login" onClick={() => {handleLogout()}}>
                         <div className='logout_btn'>
                              Logout
                         </div>
                    </NavLink>
               </div>)}
          </div>
     )
}
