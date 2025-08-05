import HeroSection from "@/components/home/hero-section"
import StatsSection from "@/components/home/stats-section"
import FeaturesSection from "@/components/home/features-section"
import CTASection from "@/components/home/cta-section"

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

export default Home