import { useState } from 'react'
import Home from './components/Home'
import Enter from './components/Enter'
import CreateBattle from './components/CreateBattle'

function App() {
  const [currentView, setCurrentView] = useState('home')

  return (
    <div>
      {currentView === 'home' && <Home onEnterArena={() => setCurrentView('enter')} />}
      {currentView === 'enter' && <Enter onBack={() => setCurrentView('home')} onCreateBattle={() => setCurrentView('create')} />}
      {currentView === 'create' && <CreateBattle onBack={() => setCurrentView('enter')} />}
    </div>
  )
}

export default App
