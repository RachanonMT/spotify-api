import React, { useEffect, useRef, useState } from 'react'
import { reducerCases } from "../Utils/Const"
import { useStateProvider } from "../Utils/StateProvider";

export default function _CreatePlaylist() {
     const [{ token, toggleCreate }, dispatch]   = useStateProvider()
     const [length, setLength] = useState(0)
     const [checked, setCheck] = useState(false)

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

     useEffect(() => {
          if(toggleCreate == false){
               backdrop.classList.add('hide')
               modal.classList.add('modal-open')
          }else{
               backdrop.classList.remove('hide')
               modal.classList.remove('modal-open')
          }
     }, [toggleCreate])

     const wrapRef = useRef(null);
     _hideCreate(wrapRef);

     return (
          <>
               <div className='modal-create' ref={wrapRef} id='modal'>
                    <div className='modal-header flex'>
                         <p className='modal-title'>Create New Playlist</p>
                         <i className="fa-solid fa-xmark" onClick={() => {const toggleCreate = false; dispatch({ type: reducerCases.SET_CREATE, toggleCreate })}} />
                    </div>
                    <div className='modal-content'>
                         <label className='content-title' htmlFor='title-playlist'>Title</label>
                         <p className='input-wrap'>
                              <input type='text' id='title-playlist' className='input-modal' placeholder='Add A Title' autoComplete='off' />
                         </p>
                         <label className='content-title' htmlFor='title-des'>Write A Description</label>
                         <p className='input-wrap relative'>
                              <textarea type='area' maxLength='300' id='title-des' className='input-modal' placeholder='Add An Optional Description...' onInput={(e) => setLength(e.target.value.length)} />
                              <span className='text-count'>{length}/300</span>
                         </p>
                         <p className='public input-wrap relative flex'>
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
                         </p>
                    </div>
                    <div className='modal-footer'>
                         <div className='create-btn'>Create New</div>
                    </div>
               </div>
               <div className='backdrop' id='backdrop'></div>
          </>
     )
}
