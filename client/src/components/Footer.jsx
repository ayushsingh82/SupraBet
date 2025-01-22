import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-sm mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-400">
              The ultimate token price prediction platform on Supra Network
            </p>
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

          {/* Navigation Links */}
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

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 SupraBet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 