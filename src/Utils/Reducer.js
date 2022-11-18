import { reducerCases } from "./Const";

export const initialState = {
     token: null,
     currentPlaying: null,
     deviceId: '',
     device: null,
     data: 0,
     queue: false,
     state: false,
     nowPlaying: "",
     playlist: null,
};

const reducer = (state, action) => {
     switch (action.type) {
          case reducerCases.SET_TOKEN:
               return {
                    ...state,
                    token: action.token,
               };
          case reducerCases.SET_PLAYING:
               return {
                    ...state,
                    currentPlaying: action.currentPlaying,
               };
          case reducerCases.SET_PLAYER:
               return {
                    ...state,
                    deviceId: action.deviceId,
               };
          case reducerCases.SET_DEVICE:
               return {
                    ...state,
                    device: action.device,
               };
          case reducerCases.SET_DATA:
               return {
                    ...state,
                    data: action.data,
               };
          case reducerCases.SET_QUEUE:
               return {
                    ...state,
                    queue: action.queue,
               };
          case reducerCases.SET_STATE:
               return {
                    ...state,
                    state: action.state,
               };
          case reducerCases.SET_NOW_PLAY:
               return {
                    ...state,
                    nowPlaying: action.nowPlaying,
               };
          case reducerCases.SET_PLAYLIST:
               return {
                    ...state,
                    playlist: action.playlist,
               };
          default:
               return state;
     }
};

export default reducer;
