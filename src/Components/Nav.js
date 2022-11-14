import React from "react";
import { Routes, Route } from "react-router-dom";
import _Home from "../Pages/_Home";
import _Tracks from "../Pages/_Tracks";
import _Albums from "../Pages/_Albums";
import _AlbumTrack from "../Pages/_AlbumTrack";
import _Playlists from "../Pages/_Playlists";
import _PlaylistTrack from "../Pages/_PlaylistTrack";
import _Artists from "../Pages/_Artists";
import _ArtistTrack from "../Pages/_ArtistTrack";


export default function Nav() {
     return (
          <React.Fragment>
               <Routes>
                    <Route path="/" element={<_Home/>} />
                    <Route path="/me/collection/tracks" element={<_Tracks/>} />
                    <Route path="/me/playlists" element={<_Playlists/>} />
                    <Route path="/me/playlist/" element={<_PlaylistTrack />} />
                    <Route path="/me/albums" element={<_Albums />} />
                    <Route path="/me/album/" element={<_AlbumTrack />} />
                    <Route path="/me/artists" element={<_Artists />} />
                    <Route path="/me/artist/" element={<_ArtistTrack />} />
               </Routes>
          </React.Fragment>
     );
};
