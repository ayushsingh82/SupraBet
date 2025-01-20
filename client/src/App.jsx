import { useState } from 'react'
import Home from './components/Home'
import Enter from './components/Enter'
import CreateBattle from './components/CreateBattle'
import WalletConnect from './components/WalletConnect'
import Logo from './components/Logo'

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
      {/* Global Header */}
      <div className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center">
        <div className="ml-4">
          <Logo />
        </div>
        <div>
          <WalletConnect />
        </div>
      </div>
      {renderView()}
    </div>
  )
}

export default App
