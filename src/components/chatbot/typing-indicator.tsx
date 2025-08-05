import React from "react"
import { Bot, Brain } from "lucide-react"

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 message-bubble-3d">
      <div className="w-10 h-10 rounded-full bot-avatar-3d flex items-center justify-center flex-shrink-0">
        <Brain className="h-5 w-5 text-white animate-pulse" />
      </div>
      <div className="flex-1 max-w-[80%]">
        <div className="bot-message-3d rounded-2xl p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-sm">يفكر في الإجابة...</span>
            <div className="flex gap-1">
              <div 
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" 
                style={{ animationDelay: "0s" }} 
              />
              <div 
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" 
                style={{ animationDelay: "0.2s" }} 
              />
              <div 
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" 
                style={{ animationDelay: "0.4s" }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator