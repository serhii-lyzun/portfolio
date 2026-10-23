import { CaseSheet } from '@/components/case/CaseSheet'
import { GlobalLightbox } from '@/components/GlobalLightbox'
import { useCaseRoute } from '@/hooks/useCaseRoute'
import { Cases } from '@/sections/Cases'
import { Contact } from '@/sections/Contact'
import { Credentials } from '@/sections/Credentials'
import { Ecosystem } from '@/sections/Ecosystem'
import { Footer } from '@/sections/Footer'
import { Hero } from '@/sections/Hero'
import { HowILead } from '@/sections/HowILead'
import { Metrics } from '@/sections/Metrics'
import { Nav } from '@/sections/Nav'
import { SceneBackdrop } from '@/sections/SceneBackdrop'
import { Testimonials } from '@/sections/Testimonials'

export default function App() {
  const { activeCase, close } = useCaseRoute()

  return (
    <>
      <a
        href="#cases"
        className="sr-only z-50 rounded-full bg-coral px-4 py-2 font-medium text-night-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to cases
      </a>

      {/* Ambient glow (the only backdrop where the 3D scene doesn't run) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] size-[30rem] rounded-full bg-coral/10 blur-3xl" />
      </div>
      <SceneBackdrop />

      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Cases />
        <Ecosystem />
        <HowILead />
        <Testimonials />
        <Credentials />
        <Contact />
      </main>
      <Footer />

      <CaseSheet item={activeCase} onClose={close} />
      <GlobalLightbox />
    </>
  )
}
