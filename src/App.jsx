import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hero from './pages/Hero'
import { ThemeInit } from '../.flowbite-react/init.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeInit />
      {/* Hero */}
      <Hero />
    </>
  )
}

export default App
