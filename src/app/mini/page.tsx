import { HomePageContent } from '@/components/HomePageContent'
import { MiniAppReady } from '@/components/MiniAppReady'

export default function MiniAppPage() {
  return (
    <>
      <MiniAppReady />
      <HomePageContent miniEntry />
    </>
  )
}
