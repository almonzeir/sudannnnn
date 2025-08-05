import React from "react"
import RobotAvatar from "./robot-avatar"
import { User } from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface PerfectChatMessageProps {
  message: Message
}

const PerfectChatMessage: React.FC<PerfectChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex gap-4 mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.type === 'bot' && (
        <RobotAvatar size="medium" />
      )}
      
      <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={message.type === 'bot' ? 'speech-bubble' : 'user-bubble'}>
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
            message.type === 'bot' ? 'text-gray-800' : 'text-white'
          }`}>
            {message.content}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-2">
          {message.timestamp.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      
      {message.type === 'user' && (
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  )
}

export default PerfectChatMessage