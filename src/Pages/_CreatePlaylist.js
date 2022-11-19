import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from "../Utils/StateProvider";

export default function _CreatePlaylist() {
     const [{ token, toggleCreate, userId }, dispatch]   = useStateProvider()
     const [length, setLength] = useState(0)
     const [checked, setCheck] = useState(false)
     const [name, setName] = useState('')
     const [description, setDescription] = useState('')

     const _hideCreate = (ref) => {
          useEffect(() => {
               const handleClickOutside = (event) => {
                    if (ref.current && !ref.current.contains(event.target)) {
                         const toggleCreate = false
                         dispatch({ type: reducerCases.SET_CREATE, toggleCreate })
                    }
               }
               document.addEventListener("mousedown", handleClickOutside);
               return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
               };
          }, [ref]);
     }

     const handleCheck = () => {
          if(checked === true){
               setCheck(false)
          }else{
               setCheck(true)
          }
     }

     const createPlaylist = async () => {
          if(name !== '')
          await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`,
               {
                    name: name,
                    description: description,
                    public: checked,
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          const toggleCreate = false
          dispatch({ type: reducerCases.SET_CREATE, toggleCreate })
     }

     useEffect(() => {
          if(toggleCreate == true){
               backdrop.classList.remove('hide')
               modalPlaylist.classList.add('modal-open')
          }else{
               backdrop.classList.add('hide')
               modalPlaylist.classList.remove('modal-open')
          }
     }, [toggleCreate])

     const wrapRef = useRef(null);
     _hideCreate(wrapRef);

     return (
          <>
               <div className='modal-create' ref={wrapRef} id='modalPlaylist'>
                    <div className='modal-header flex'>
                         <p className='modal-title'>Create New Playlist</p>
                         <i className="fa-solid fa-xmark" onClick={() => {const toggleCreate = false; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}} />
                    </div>
                    <div className='modal-content'>
                         <label className='content-title' htmlFor='title-playlist'>Title</label>
                         <p className='input-wrap'>
                              <input type='text' id='title-playlist' className='input-modal' placeholder='Add A Title' autoComplete='off' onInput={(e) => setName(e.target.value)} />
                         </p>
                         <label className='content-title' htmlFor='title-des'>Write A Description</label>
                         <p className='input-wrap relative'>
                              <textarea type='area' maxLength='300' id='title-des' className='input-modal' placeholder='Add An Optional Description...' onInput={(e) => {setLength(e.target.value.length); setDescription(e.target.value)}} />
                              <span className='text-count'>{length}/300</span>
                         </p>
                         <div className='public input-wrap relative flex'>
                              <div>
                                   <label htmlFor='private' className='private'>Public Playlist</label>
                                   <div className='detail'>Public playlists will be visible on your Profile and accessible by anyone.</div>
                              </div>
                              <div className='toggle-switch'>
                                   <label className="switch" htmlFor='private'>
                                        <input type="checkbox" id='private' defaultChecked={checked} onChange={handleCheck} />
                                        <span className="slider round"></span>
                                   </label>
                              </div>
                         </div>
                    </div>
                    <div className='modal-footer'>
                         <div className='create-btn' onClick={createPlaylist}>Create New</div>
                    </div>
               </div>
               <div className='backdrop' id='backdrop'></div>
          </>
     )
}
