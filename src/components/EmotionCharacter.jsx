import { motion } from 'framer-motion'

const characterStyles = {
  joy: {
    bg: 'radial-gradient(circle, #FFE066 0%, #FFD700 40%, #FFA500 100%)',
    shadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
    face: '😊',
    eyes: { color: '#8B4513', shape: 'happy' },
  },
  anger: {
    bg: 'radial-gradient(circle, #FF6B6B 0%, #FF4444 40%, #CC0000 100%)',
    shadow: '0 0 30px rgba(255, 68, 68, 0.6), 0 0 60px rgba(255, 68, 68, 0.3)',
    face: '😠',
    eyes: { color: '#fff', shape: 'angry' },
  },
  sadness: {
    bg: 'radial-gradient(circle, #87CEEB 0%, #4A90D9 40%, #2E5CB8 100%)',
    shadow: '0 0 30px rgba(74, 144, 217, 0.6), 0 0 60px rgba(74, 144, 217, 0.3)',
    face: '😢',
    eyes: { color: '#1a3a5c', shape: 'sad' },
  },
  fear: {
    bg: 'radial-gradient(circle, #C39BD3 0%, #9B59B6 40%, #6C3483 100%)',
    shadow: '0 0 30px rgba(155, 89, 182, 0.6), 0 0 60px rgba(155, 89, 182, 0.3)',
    face: '😨',
    eyes: { color: '#2d1b4e', shape: 'fear' },
  },
  disgust: {
    bg: 'radial-gradient(circle, #7DCEA0 0%, #2ECC71 40%, #1E8449 100%)',
    shadow: '0 0 30px rgba(46, 204, 113, 0.6), 0 0 60px rgba(46, 204, 113, 0.3)',
    face: '😤',
    eyes: { color: '#145A32', shape: 'disgust' },
  },
}

const floatVariants = {
  joy: {
    y: [0, -12, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  anger: {
    y: [0, -8, 0],
    rotate: [0, -2, 2, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  sadness: {
    y: [0, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  fear: {
    y: [0, -5, 0],
    x: [-1, 1, -1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  disgust: {
    y: [0, -10, 0],
    rotate: [0, 3, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

const EmotionCharacter = ({ emotionId, size = 'large', onClick, selected }) => {
  const style = characterStyles[emotionId]
  const sizeClass = size === 'large' ? 'w-20 h-20' : size === 'medium' ? 'w-14 h-14' : 'w-10 h-10'
  const fontSize = size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-lg'

  return (
    <motion.div
      className={`relative cursor-pointer select-none`}
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      animate={floatVariants[emotionId]}
    >
      {/* Glow ring */}
      <motion.div
        className={`absolute inset-0 ${sizeClass} rounded-full opacity-40`}
        style={{ background: style.bg, filter: 'blur(15px)' }}
        animate={selected ? { scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] } : {}}
        transition={{ duration: 1.5, repeat: selected ? Infinity : 0 }}
      />

      {/* Main body */}
      <motion.div
        className={`${sizeClass} rounded-full flex items-center justify-center relative overflow-hidden`}
        style={{
          background: style.bg,
          boxShadow: style.shadow,
        }}
      >
        {/* Highlight */}
        <div
          className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
        />

        {/* Face */}
        <span className={`${fontSize} relative z-10`} role="img">
          {style.face}
        </span>
      </motion.div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          className="absolute -inset-2 rounded-full border-2 border-white/50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        />
      )}
    </motion.div>
  )
}

export default EmotionCharacter
