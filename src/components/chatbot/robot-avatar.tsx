import React from "react"

interface RobotAvatarProps {
  size?: 'small' | 'medium' | 'large'
  showPulse?: boolean
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ 
  size = 'medium', 
  showPulse = false 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-20 h-20'
  }

  return (
    <div className={`robot-avatar ${sizeClasses[size]} ${showPulse ? 'animate-pulse' : ''}`}>
      <div className="medical-cross" />
      
      {/* Robot Eyes */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full opacity-80" />
        <div className="w-2 h-2 bg-white rounded-full opacity-80" />
      </div>
      
      {/* Robot Smile */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-1 bg-white rounded-full opacity-60" />
      </div>
    </div>
  )
}

export default RobotAvatar