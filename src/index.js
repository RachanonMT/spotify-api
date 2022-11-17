import App from './Components/App'
import ReactDOM from 'react-dom/client'
import { StateProvider } from './Utils/StateProvider'
import reducer, { initialState } from "./Utils/Reducer"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
     <StateProvider initialState={initialState} reducer={reducer}>
          <App/>
     </StateProvider>
);