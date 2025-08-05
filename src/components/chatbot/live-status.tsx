import React from "react"

interface LiveStatusProps {
  isOnline?: boolean
  message?: string
}

const LiveStatus: React.FC<LiveStatusProps> = ({ 
  isOnline = true, 
  message = "متاح الآن" 
}) => {
  if (!isOnline) return null

  return (
    <div className="fixed bottom-28 right-6 z-40 hidden md:block">
      <div className="live-status">
        <div className="status-dot" />
        <span>{message}</span>
      </div>
    </div>
  )
}

export default LiveStatus