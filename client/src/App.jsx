import React, { useState } from 'react'
import Home from './components/Home'
import Enter from './components/Enter'
import CreateBattle from './components/CreateBattle'
import Transfer from './components/Transfer'
import WalletConnect from './components/WalletConnect'
import Logo from './components/Logo'

function App() {
  const [currentView, setCurrentView] = useState('home')
  
  console.log('Current View:', currentView) // Debug log

  const renderView = () => {
    console.log('Rendering view:', currentView) // Debug log
    switch (currentView) {
      case 'home':
        return <Home onEnterArena={() => setCurrentView('enter')} />
      case 'enter':
        return (
          <Enter 
            onBack={() => setCurrentView('home')} 
            onCreateBattle={() => setCurrentView('create')}
            onTransfer={() => setCurrentView('transfer')}
          />
        )
      case 'create':
        return <CreateBattle onBack={() => setCurrentView('enter')} />
      case 'transfer':
        return <Transfer onBack={() => setCurrentView('enter')} />
      default:
        return <Home onEnterArena={() => setCurrentView('enter')} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 flex justify-between items-center">
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
