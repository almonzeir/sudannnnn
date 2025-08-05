import React, { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"

interface GreetingBubbleProps {
  onDismiss?: () => void
  autoHideDuration?: number
}

const GreetingBubble: React.FC<GreetingBubbleProps> = ({ 
  onDismiss, 
  autoHideDuration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, autoHideDuration)

    return () => clearTimeout(timer)
  }, [autoHideDuration, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className="greeting-bubble hidden md:block" dir="rtl">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">
          👋 مرحبًا! أنا مساعدك الذكي. اسألني عن أي دواء تريده.
        </span>
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export default GreetingBubble