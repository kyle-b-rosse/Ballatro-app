import BasketballCardGame from './BasketballCardGameApp.jsx'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <BasketballCardGame />
      <Analytics />
    </>
  )
}

export default App
