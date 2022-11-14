import axios from 'axios'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStateProvider } from '../Auth/StateProvider'

export default function Profile() {
     const [{ token, device }] = useStateProvider()
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
          const Element = document.querySelector(".profile_btn");
          if (event.target.className != Element.className && event.target.className != 'find') {
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
               <div className='profile_btn' onClick={() => {handleProfile()}}>
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
