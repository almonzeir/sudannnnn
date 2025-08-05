import React from "react"
import { Bot, User } from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className="flex gap-3 message-bubble-3d">
      {message.type === 'bot' ? (
        <>
          <div className="w-10 h-10 rounded-full bot-avatar-3d flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 max-w-[80%]">
            <div className="bot-message-3d rounded-2xl p-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                {message.content}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-2">
              {message.timestamp.toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1" />
          <div className="max-w-[80%]">
            <div className="user-message-3d rounded-2xl p-4">
              <p className="text-sm leading-relaxed text-white">
                {message.content}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-left px-2">
              {message.timestamp.toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="h-5 w-5 text-white" />
          </div>
        </>
      )}
    </div>
  )
}

export default ChatMessage