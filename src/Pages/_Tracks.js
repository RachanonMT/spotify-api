import { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateProvider } from '../Utils/StateProvider'
import AddedDate from '../Helpers/AddedDate'
import ConvertMs from '../Helpers/ConvertMs'
import _ListTrack from './_ListTrack'

export default function _Tracks() {
     const [{ token }]  = useStateProvider()
     const [tracks, setTracks]                    = useState([])
     const [savedTrack, setSavedTrack]            = useState([])

     const getTracks = async () => {
          setSavedTrack([])
          const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50`, {
               headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
               },
          })
          const { items } = response.data;
          items.map(( track ) => {
               setSavedTrack(( savedTrack ) => ([...savedTrack, track.track.id]))
               setTracks(( tracks ) => ([...tracks, {
                    track: {
                         uris: [track.track.uri],
                         position_ms: 0,
                         id: track.track.id,
                    },
                    id: track.track.id,
                    title: track.track.name,
                    album: track.track.album.name,
                    album_id: track.track.album.id,
                    artist: track.track.artists.map((artist) => artist.name),
                    artistId: track.track.artists.map(( artist ) => artist.id),
                    explicit: track.track.explicit,
                    cover: track.track.album.images[2].url,
                    added: AddedDate(track.added_at),
                    duration: ConvertMs(track.track.duration_ms),
                    uri: track.track.uri,
                    url: track.track.external_urls.spotify
               }]))
          })
     };

     useEffect(() => {
          getTracks();
     }, []);

     return (
          <div className='tracks'>
               <p className='title'>My Tracks</p>
               <_ListTrack tracks={tracks} savedTrack={savedTrack} type={0}/>
          </div>
     )
}
