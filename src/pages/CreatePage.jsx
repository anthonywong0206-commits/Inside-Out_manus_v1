import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import EmotionCharacter from '../components/EmotionCharacter'
import CreateMemoryModal from '../components/CreateMemoryModal'
import { emotions } from '../data/emotions'

const CreatePage = ({ onSave }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEmotionClick = (emotionId) => {
    setSelectedEmotion(emotionId)
    setShowModal(true)
  }

  const handleSave = (memory) => {
    onSave(memory)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
          今天，
          <br />
          你留下了什麼情緒？
        </h1>
        <p className="text-white/50 text-sm">每段回憶，都值得被收藏。</p>
      </motion.div>

      {/* Emotion characters grid */}
      <motion.div
        className="grid grid-cols-3 gap-6 sm:gap-8 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Row 1: Joy and Anger */}
        <div className="col-span-3 flex justify-center gap-12 sm:gap-16">
          {emotions.slice(0, 2).map((emotion) => (
            <div key={emotion.id} className="flex flex-col items-center gap-2">
              <EmotionCharacter
                emotionId={emotion.id}
                size="large"
                onClick={() => handleEmotionClick(emotion.id)}
                selected={selectedEmotion === emotion.id}
              />
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white/80 text-xs font-medium">{emotion.name}</p>
                <p className="text-white/40 text-[10px]">{emotion.nameEn}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Row 2: Sadness, Fear, Disgust */}
        <div className="col-span-3 flex justify-center gap-8 sm:gap-12">
          {emotions.slice(2).map((emotion) => (
            <div key={emotion.id} className="flex flex-col items-center gap-2">
              <EmotionCharacter
                emotionId={emotion.id}
                size="large"
                onClick={() => handleEmotionClick(emotion.id)}
                selected={selectedEmotion === emotion.id}
              />
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-white/80 text-xs font-medium">{emotion.name}</p>
                <p className="text-white/40 text-[10px]">{emotion.nameEn}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Create Modal */}
      <CreateMemoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedEmotion={selectedEmotion || 'joy'}
        onSave={handleSave}
      />

      {/* Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-3xl p-8 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">記憶已收藏</h3>
              <p className="text-white/60 text-sm">你的情緒記憶球已安全收藏</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreatePage
