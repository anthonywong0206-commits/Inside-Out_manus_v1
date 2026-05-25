import { motion } from 'framer-motion'
import { getEmotionById } from '../data/emotions'

const MemoryBall = ({ memory, onClick, size = 'medium', index = 0 }) => {
  const emotion = getEmotionById(memory.emotion)
  const sizeMap = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
  }

  const randomDelay = index * 0.3
  const randomDuration = 4 + Math.random() * 3

  return (
    <motion.div
      className={`relative cursor-pointer select-none`}
      onClick={() => onClick && onClick(memory)}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -15, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: randomDelay * 0.1 },
        scale: { duration: 0.5, delay: randomDelay * 0.1 },
        y: { duration: randomDuration, repeat: Infinity, ease: 'easeInOut', delay: randomDelay },
      }}
    >
      {/* Outer glow */}
      <div
        className={`absolute inset-0 ${sizeMap[size]} rounded-full blur-xl opacity-30`}
        style={{ backgroundColor: emotion.color }}
      />

      {/* Main ball */}
      <div
        className={`${sizeMap[size]} rounded-full relative overflow-hidden flex items-center justify-center`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${emotion.color}88, ${emotion.color}44, ${emotion.color}22)`,
          boxShadow: `0 0 20px ${emotion.color}44, inset 0 0 20px ${emotion.color}22`,
          border: `1px solid ${emotion.color}33`,
        }}
      >
        {/* Glass highlight */}
        <div
          className="absolute top-1 left-2 w-2/5 h-2/5 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Content preview */}
        <div className="text-center px-1 relative z-10">
          <p className="text-[8px] text-white/80 font-medium line-clamp-2 leading-tight">
            {memory.title}
          </p>
        </div>

        {/* Bottom reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-full"
          style={{
            background: `linear-gradient(to top, ${emotion.color}11, transparent)`,
          }}
        />
      </div>
    </motion.div>
  )
}

export default MemoryBall
