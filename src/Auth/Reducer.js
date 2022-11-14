import { reducerCases } from "./Const";

export const initialState = {
     token: null,
     currentPlaying: null,
     deviceId: '',
     device: null,
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
          default:
               return state;
     }
};

export default reducer;
