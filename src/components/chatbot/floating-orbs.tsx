import React from "react"

const FloatingOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large Cyan Orb */}
      <div className="floating-orb floating-orb-1" />
      
      {/* Medium Blue Orb */}
      <div className="floating-orb floating-orb-2" />
      
      {/* Small Purple Orb */}
      <div className="floating-orb floating-orb-3" />
      
      {/* Additional Small Orbs */}
      <div 
        className="floating-orb"
        style={{
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 70%, transparent 100%)',
          top: '30%',
          right: '25%',
          animationDelay: '-4s',
          animationDuration: '10s'
        }}
      />
      
      <div 
        className="floating-orb"
        style={{
          width: '30px',
          height: '30px',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0.1) 70%, transparent 100%)',
          bottom: '40%',
          right: '35%',
          animationDelay: '-7s',
          animationDuration: '12s'
        }}
      />
    </div>
  )
}

export default FloatingOrbs