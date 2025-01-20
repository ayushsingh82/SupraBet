import React from 'react'

const SupraIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 500 500" 
    fill="none" 
    className="inline-block ml-1"
  >
    <path
      d="M250 0C388.071 0 500 111.929 500 250C500 388.071 388.071 500 250 500C111.929 500 0 388.071 0 250C0 111.929 111.929 0 250 0ZM250 50C139.543 50 50 139.543 50 250C50 360.457 139.543 450 250 450C360.457 450 450 360.457 450 250C450 139.543 360.457 50 250 50Z"
      fill="currentColor"
      className="text-primary animate-spin-slow"
    />
    <path
      d="M250 100C332.843 100 400 167.157 400 250C400 332.843 332.843 400 250 400C167.157 400 100 332.843 100 250C100 167.157 167.157 100 250 100ZM250 150C194.772 150 150 194.772 150 250C150 305.228 194.772 350 250 350C305.228 350 350 305.228 350 250C350 194.772 305.228 150 250 150Z"
      fill="currentColor"
      className="text-primary"
    />
  </svg>
)

const Logo = ({ size = 'normal' }) => {
  const textSize = size === 'large' ? 'text-6xl' : 'text-2xl'
  const iconSize = size === 'large' ? 'w-8 h-8' : 'w-5 h-5'
  const supraLogoSize = size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
  
  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        {/* Supra Logo */}
        <div className={`${supraLogoSize} relative`}>
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-all"></div>
          <img 
            src="https://pbs.twimg.com/profile_images/1749358202985295872/FcxNf6dw_400x400.png"
            alt="Supra" 
            className="w-full h-full object-contain relative animate-float rounded-full"
          />
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-1 bg-primary/30 blur-lg rounded-full animate-glow"></div>
        <div className={`font-bold ${textSize} text-white relative flex items-center group`}>
          <span className="group-hover:text-primary transition-colors">Supra</span>
          <span className="text-primary">Bet</span>
          <div className={`${iconSize} transition-transform group-hover:rotate-180 duration-700`}>
            <SupraIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logo 