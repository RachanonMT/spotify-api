import axios from "axios"
import { useEffect, useState } from "react"
import { useStateProvider } from '../Auth/StateProvider'

export default function LikeTrack(trackId) {
     const [{ token }]                  = useStateProvider()
     const [id, setId]                  = useState('')
     const [savedTrack, setSavedTrack]  = useState(false)

     const checkTrack = async () => {
          const res = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          setSavedTrack(res.data[0])
     }
  
     const likeTrack = async () => {
          await axios.put(`https://api.spotify.com/v1/me/tracks`, 
               {
                    "ids": [id]
               },
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          console.log("Like");
     }

     const unlikeTrack = async () => {
          await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${id}`, 
               {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               }
          )
          console.log("Unlike");
     }

     useEffect(() => {
          setId(trackId)
     }, [])

     useEffect(() => {
          checkTrack()
     }, [id])

     useEffect(() => {
          console.log(2);
          if(savedTrack == true){
               unlikeTrack()
          }else{
               likeTrack()
          }
     }, [savedTrack])
}


