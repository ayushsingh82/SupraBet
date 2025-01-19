import { useState } from 'react'
import Home from './components/Home'
import Enter from './components/Enter'
import CreateBattle from './components/CreateBattle'

function App() {
  const [currentView, setCurrentView] = useState('home')
  
  console.log('Current View:', currentView) // Debug log

  const renderView = () => {
    console.log('Rendering view:', currentView) // Debug log
    switch(currentView) {
      case 'home':
        return <Home onEnterArena={() => {
          console.log('Enter Arena clicked') // Debug log
          setCurrentView('enter')
        }} />
      case 'enter':
        return <Enter onBack={() => setCurrentView('home')} onCreateBattle={() => setCurrentView('create')} />
      case 'create':
        return <CreateBattle onBack={() => setCurrentView('enter')} />
      default:
        return <Home onEnterArena={() => setCurrentView('enter')} />
    }
  }

  return (
    <div>
      {renderView()}
    </div>
  )
}

export default App
