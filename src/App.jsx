import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground'
import BottomNav from './components/BottomNav'
import CreatePage from './pages/CreatePage'
import CollectionPage from './pages/CollectionPage'
import StatsPage from './pages/StatsPage'
import CalendarPage from './pages/CalendarPage'
import ReviewPage from './pages/ReviewPage'
import { useMemoryStore } from './store/useMemoryStore'

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)' },
}

function App() {
  const [currentPage, setCurrentPage] = useState('create')
  const { memories, addMemory, updateMemory, deleteMemory } = useMemoryStore()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 1500)
  })

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-cosmos-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(155,89,182,0.3), rgba(155,89,182,0.1))',
              boxShadow: '0 0 40px rgba(155,89,182,0.3)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 40px rgba(155,89,182,0.3)',
                '0 0 60px rgba(155,89,182,0.5)',
                '0 0 40px rgba(155,89,182,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">🌌</span>
          </motion.div>
          <h1 className="text-xl font-bold text-white mb-2">Emotion Memory</h1>
          <p className="text-white/40 text-sm">把每一份情緒，好好收藏。</p>
          <motion.div
            className="mt-6 w-32 h-1 mx-auto rounded-full overflow-hidden bg-white/10"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreatePage onSave={addMemory} />
      case 'collection':
        return <CollectionPage memories={memories} onDelete={deleteMemory} onUpdate={updateMemory} />
      case 'stats':
        return <StatsPage memories={memories} />
      case 'calendar':
        return <CalendarPage memories={memories} onDelete={deleteMemory} />
      case 'review':
        return <ReviewPage memories={memories} />
      default:
        return <CreatePage onSave={addMemory} />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative max-w-md mx-auto">
      {/* Particle background */}
      <ParticleBackground />

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 h-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
