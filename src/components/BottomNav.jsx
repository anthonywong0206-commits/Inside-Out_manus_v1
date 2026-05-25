import { motion } from 'framer-motion'
import { PlusCircle, Globe2, BarChart3, Calendar, Sparkles } from 'lucide-react'

const navItems = [
  { id: 'create', label: '創建', icon: PlusCircle },
  { id: 'collection', label: '記憶集', icon: Globe2 },
  { id: 'stats', label: '統計', icon: BarChart3 },
  { id: 'calendar', label: '日曆', icon: Calendar },
  { id: 'review', label: '回顧', icon: Sparkles },
]

const BottomNav = ({ currentPage, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-strong rounded-2xl mx-auto max-w-md flex items-center justify-around py-2 px-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-300 relative ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={`relative z-10 transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''
                }`}
              />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </motion.button>
          )
        })}
      </motion.nav>
    </div>
  )
}

export default BottomNav
