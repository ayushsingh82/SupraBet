import React from 'react'
import Logo from './Logo'
import Footer from './Footer'

const Home = ({ onEnterArena }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/30">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-pulse-slow"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-secondary/40 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative inline-block mb-8 animate-float">
              <Logo size="large" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-slide-up">
              Predict. Bet. Win.
            </h1>
            <p className="text-xl text-gray-300 mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
              The Ultimate DeFi Price Prediction Platform on Supra Network
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button 
                onClick={onEnterArena}
                className="group bg-primary text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10">Enter Arena</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-pink-500 to-primary bg-[length:200%] animate-gradient hover:bg-right"></div>
              </button>
              <button className="group border border-primary/50 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:border-primary">
                Learn More
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Battles Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Live <span className="text-primary">Battles</span>
          </h2>
          <p className="text-gray-400">Active price prediction battles happening right now</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              pair: ["ETH", "BTC"],
              pool: "1000 SUPRA",
              bettors: "8/10",
              timeLeft: "5:00",
              trends: ["↗", "↘"],
              prices: ["$2,450", "$43,210"],
              changes: ["+2.5%", "-1.2%"]
            },
            {
              pair: ["SUPRA", "USDT"],
              pool: "500 SUPRA",
              bettors: "4/6",
              timeLeft: "2:30",
              trends: ["↗", "→"],
              prices: ["$1.25", "$1.00"],
              changes: ["+5.2%", "0.0%"]
            }
          ].map((battle, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
                  <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-secondary/20 rounded-full filter blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative backdrop-blur-sm rounded-3xl p-8">
                {/* VS Animation */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-primary/20 group-hover:scale-150 transition-transform duration-500">
                  VS
                </div>

                {/* Battle Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-primary opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-primary"></span>
                    <h3 className="text-2xl font-bold text-white">Battle #{index + 1}</h3>
                  </div>
                  <div className="bg-background/40 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse">
                    <p className="text-sm text-primary font-semibold">{battle.timeLeft} Left</p>
                  </div>
                </div>

                {/* Tokens */}
                <div className="flex justify-between items-center mb-8">
                  {[0, 1].map((i) => (
                    <div 
                      key={i}
                      className={`w-1/2 ${i === 0 ? 'pr-4 text-right' : 'pl-4 text-left'} transform transition-transform duration-500 ${
                        i === 0 ? 'group-hover:-translate-x-4' : 'group-hover:translate-x-4'
                      }`}
                    >
                      <div className={`inline-block ${i === 0 ? 'origin-right' : 'origin-left'} group-hover:scale-110 transition-transform duration-500`}>
                        <div className="w-16 h-16 bg-background/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:animate-bounce">
                          <span className="text-2xl font-bold text-primary">{battle.pair[i]}</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-bold text-white">{battle.prices[i]}</p>
                          <p className={`text-sm font-medium ${
                            battle.changes[i].startsWith('+') ? 'text-green-500' : 
                            battle.changes[i].startsWith('-') ? 'text-red-500' : 
                            'text-gray-400'
                          } flex items-center justify-center gap-1`}>
                            <span className="text-lg">{battle.trends[i]}</span>
                            {battle.changes[i]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Battle Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-background/20 backdrop-blur-sm rounded-2xl p-4 transform transition-all duration-500 group-hover:scale-105 group-hover:bg-background/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:animate-spin-slow">
                        🏆
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Prize Pool</p>
                        <p className="text-lg font-bold text-primary">{battle.pool}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background/20 backdrop-blur-sm rounded-2xl p-4 transform transition-all duration-500 group-hover:scale-105 group-hover:bg-background/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:animate-bounce">
                        👥
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Bettors</p>
                        <p className="text-lg font-bold text-white">{battle.bettors}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="bg-primary/90 backdrop-blur-sm text-white px-8 py-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-primary flex items-center gap-2">
                    Join Battle
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-secondary/40 backdrop-blur-md rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          
          <div className="relative">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Platform <span className="text-primary">Statistics</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Total Bets", value: "10K+", icon: "🎯" },
                { label: "Total Pool", value: "$1M+", icon: "💰" },
                { label: "Active Bettors", value: "5K+", icon: "👥" },
                { label: "Avg. Win Rate", value: "48%", icon: "📈" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-background/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  )
}

export default Home