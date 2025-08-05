import React from "react"
import { Heart, Stethoscope, Pill, Cross } from "lucide-react"

const MedicalFloats: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Medical Icons Floating */}
      <div className="medical-float medical-float-1">
        <Heart className="w-8 h-8 text-cyan-300" />
      </div>
      
      <div className="medical-float medical-float-2">
        <Stethoscope className="w-10 h-10 text-blue-300" />
      </div>
      
      <div className="medical-float medical-float-3">
        <Pill className="w-6 h-6 text-cyan-400" />
      </div>
      
      {/* Additional floating crosses */}
      <div 
        className="medical-float"
        style={{
          top: '60%',
          right: '10%',
          animationDelay: '-6s'
        }}
      >
        <Cross className="w-7 h-7 text-blue-200" />
      </div>
      
      <div 
        className="medical-float"
        style={{
          bottom: '15%',
          right: '30%',
          animationDelay: '-3s'
        }}
      >
        <Heart className="w-5 h-5 text-cyan-200" />
      </div>
    </div>
  )
}

export default MedicalFloats