import { useState } from 'react'

// Components
import MapContainer from './components/MapContainer';

// Styles
import './styles/main.scss';

const App: React.FC = () => {
  
  return (
    <div className="app">
      <div className='app__main'>
        <MapContainer />
      </div>
    </div>
  )
}

export default App
