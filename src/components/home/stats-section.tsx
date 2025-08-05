import { BookOpen, Users, CheckCircle, Clock } from "lucide-react"

const StatsSection = () => {
  const stats = [
    { number: "10,000+", label: "دواء في القاعدة", icon: BookOpen },
    { number: "500+", label: "صيدلي معتمد", icon: Users },
    { number: "50,000+", label: "استشارة مكتملة", icon: CheckCircle },
    { number: "24/7", label: "متاح دائماً", icon: Clock }
  ]

  return (
    <section className="py-16 section-divider bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-3 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection