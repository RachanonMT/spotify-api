import axios from 'axios'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStateProvider } from '../Utils/StateProvider'
import ConvertMs from '../Helpers/ConvertMs'
import _ListTrack from './_ListTrack'

export default function _Home() {
     
     const [{ token, currentPlaying }]  = useStateProvider()
     const [tracks, setTracks]          = useState([])     
     const [albums, setAlbums]          = useState([])
     const [savedTrack, setSavedTrack]  = useState([])
     const [seeds, setSeeds]            = useState([])

     const getSeeds = async () => {
          setSeeds([])
          const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=5`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          setSeeds({
               seeds: response.data.items.map(( seed ) => seed.id)
          })
     }
     
     const getRecommend = async () => {
          if(seeds){
               const res = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${seeds.seeds?.join(",")}&limit=5`, {
                    headers: {
                         Authorization: "Bearer " + token,
                         "Content-Type": "application/json",
                    },
               })
               res.data.tracks.map(( track ) => {
                    setSavedTrack(( savedTrack ) => ([...savedTrack, track.id]))
                    setTracks(( tracks ) => ([...tracks, {
                         track: {
                              uris: [track.uri],
                              position_ms: 0,
                              id: track.id,
                         },
                         id: track.id,
                         name: track.name,
                         album: track.album.name,
                         album_id: track.album.id,
                         artist: track.artists.map((artist) => artist.name),
                         artistId: track.artists.map(( artist ) => artist.id),
                         explicit: track.explicit,
                         image: track.album.images[2].url,
                         duration: ConvertMs(track.duration_ms),
                         uri: track.uri,
                         url: track.external_urls.spotify,
                    }]))
               })
          }

          const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          response.data.albums.items.map(( album ) => {
               setAlbums(( albums ) => ([...albums, {
                    id: album.id,
                    name: album.name,
                    artist: album.artists.map(( artist ) => artist.name),
                    image: album.images[1].url,
                    release: album.release_date.substring(0, 4)
               }]))
          })
     }
    
     useEffect(() => {
          setTracks([])
          setSeeds([])
          getSeeds()
     }, [])

     useEffect(() => {
          if(seeds.length != 0){
               getRecommend()
          }
     }, [seeds])

     return (
          <div className='tracks'>
               <p className='title'>For You</p>
               <_ListTrack tracks={tracks} savedTrack={savedTrack} type={4}/>
               <div className='album_search'>
                    <p className='search_title'>New Releases</p>
                    <div className="search_album_row">
                         {albums?.map((val) => {
                              return (
                                   <NavLink key={val.id} to={`/me/album/?id=${val.id}`}>
                                        <div className='album_card'>
                                             <div className='cover'>
                                                  <img src={val.image} alt='cover'/>
                                             </div>
                                             <div className='name td'>{val.name}</div>
                                             <div className='artist td'>{val.artist[0]?.name}</div>
                                             <div className='release td'>{val.release}</div>
                                        </div>
                                   </NavLink>
                              )
                         })}
                    </div>
               </div>
          </div>
     )
}
