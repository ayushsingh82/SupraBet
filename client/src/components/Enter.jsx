import React from 'react'
import { Link } from 'react-router-dom'

const Enter = () => {
  const ongoingBattles = [
    {
      id: 1,
      name: "Crypto Titans",
      player1: "DragonSlayer",
      player2: "CryptoKnight",
      prize: "1000 SUPRA",
      timeLeft: "5:30",
      players: "2/2",
      status: "LIVE"
    },
    {
      id: 2,
      name: "Blockchain Warriors",
      player1: "PhantomTrader",
      player2: "SuperaNinja",
      prize: "2000 SUPRA",
      timeLeft: "3:45",
      players: "2/2",
      status: "LIVE"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
          <Link 
            to="/create-battle"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-all flex items-center gap-2 group"
          >
            <span className="text-xl">+</span>
            Create Battle
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-12">
          Active <span className="text-primary">Battles</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {ongoingBattles.map((battle) => (
            <div 
              key={battle.id}
              className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              {/* Battle Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{battle.name}</h2>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  {battle.status}
                </span>
              </div>

              {/* VS Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <p className="text-white font-semibold">{battle.player1}</p>
                </div>
                <div className="text-primary text-2xl font-bold">VS</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <p className="text-white font-semibold">{battle.player2}</p>
                </div>
              </div>

              {/* Battle Info */}
              <div className="grid grid-cols-3 gap-4 bg-background/30 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
                  <p className="text-primary font-bold">{battle.prize}</p>
                </div>
                <div className="text-center border-x border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Time Left</p>
                  <p className="text-white font-bold">{battle.timeLeft}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Players</p>
                  <p className="text-white font-bold">{battle.players}</p>
                </div>
              </div>

              {/* Watch Button */}
              <button className="w-full mt-6 bg-primary/10 text-primary px-6 py-3 rounded-lg hover:bg-primary/20 transition-all">
                Watch Battle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Enter