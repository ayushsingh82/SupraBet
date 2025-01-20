import React from 'react'

const Home = ({ onEnterArena }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center animate-slide-up">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-primary/30 blur-xl rounded-full animate-glow"></div>
            <h1 className="text-6xl font-bold text-white mb-6 relative">
              Token <span className="text-primary">Betting</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Predict. Bet. Win Big on Token Prices.
          </p>
          <div className="flex justify-center gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={onEnterArena}
              className="group bg-primary text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,51,102,0.5)]"
            >
              Enter Arena
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button className="border border-primary text-white px-8 py-3 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bet. <span className="text-primary">Win</span>. Profit.
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Place your bets on token price movements on Supra Network
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Token Betting",
              desc: "Bet on token price movements and win rewards from the prize pool!",
              icon: "🎯",
              delay: "0s"
            },
            {
              title: "Price Prediction",
              desc: "Use your crypto knowledge to predict price movements accurately.",
              icon: "📈",
              delay: "0.2s"
            },
            {
              title: "Fair Results",
              desc: "Powered by Supra Oracle for accurate and tamper-proof price feeds.",
              icon: "🔒",
              delay: "0.4s"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-secondary/50 backdrop-blur-sm p-8 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)] animate-slide-up"
              style={{animationDelay: feature.delay}}
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 mb-6 group-hover:animate-float flex items-center justify-center text-3xl">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Betting Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-bold text-white mb-6">
                Live Token Bets
              </h2>
              <div className="space-y-4">
                {[
                  { tokens: "ETH vs BTC", pool: "1000 SUPRA", participants: "8/10", timeLeft: "5:00" },
                  { tokens: "SUPRA vs USDT", pool: "500 SUPRA", participants: "4/6", timeLeft: "2:30" },
                ].map((bet, index) => (
                  <div key={index} className="bg-background/50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">{bet.tokens}</p>
                      <p className="text-sm text-gray-400">Token Pair</p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary font-bold">{bet.pool}</p>
                      <p className="text-sm text-gray-400">Prize Pool</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white">{bet.participants}</p>
                      <p className="text-sm text-gray-400">Bettors</p>
                    </div>
                    <div>
                      <p className="text-white">{bet.timeLeft}</p>
                      <p className="text-sm text-gray-400">Time Left</p>
                    </div>
                    <button className="bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-all">
                      Place Bet
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Section */}
            <div className="relative animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative bg-secondary/70 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Betting Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Bets", value: "10K+" },
                    { label: "Total Pool", value: "$1M+" },
                    { label: "Active Bettors", value: "5K+" },
                    { label: "Avg. Win Rate", value: "48%" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-background/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Battle Arena</h3>
              <p className="text-gray-400">The ultimate DeFi gaming platform on Supra Blockchain</p>
              <div className="flex space-x-4">
                {['Twitter', 'Discord', 'Telegram'].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: "Platform",
                links: ["How it Works", "Features", "Battles", "Leaderboard"]
              },
              {
                title: "Resources",
                links: ["Documentation", "API", "Support", "Community"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Disclaimer"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Battle Arena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home