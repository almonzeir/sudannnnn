import React from "react"
import RobotAvatar from "./robot-avatar"

const PerfectTyping: React.FC = () => {
  return (
    <div className="flex gap-4 mb-6 justify-start">
      <RobotAvatar size="medium" showPulse={true} />
      
      <div className="flex flex-col items-start">
        <div className="speech-bubble">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">يفكر...</span>
            <div className="typing-dots">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfectTyping