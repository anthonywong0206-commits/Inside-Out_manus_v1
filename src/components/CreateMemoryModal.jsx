import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart } from 'lucide-react'
import { emotions, categories, getEmotionById } from '../data/emotions'

const CreateMemoryModal = ({ isOpen, onClose, selectedEmotion, onSave }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [intensity, setIntensity] = useState(7)
  const [selectedCategories, setSelectedCategories] = useState([])

  const emotion = getEmotionById(selectedEmotion)

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      emotion: selectedEmotion,
      title: title.trim(),
      content: content.trim(),
      date,
      intensity,
      categories: selectedCategories,
    })
    // Reset form
    setTitle('')
    setContent('')
    setDate(new Date().toISOString().split('T')[0])
    setIntensity(7)
    setSelectedCategories([])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl bg-gradient-to-b from-white to-gray-50 text-gray-800"
            style={{ maxHeight: '85vh' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Scrollable content */}
            <div className="overflow-y-auto p-6 pb-8" style={{ maxHeight: '85vh' }}>
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10"
              >
                <X size={18} className="text-gray-500" />
              </button>

              {/* Emotion header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `radial-gradient(circle, ${emotion.color}66, ${emotion.color}33)`,
                    boxShadow: `0 0 15px ${emotion.color}44`,
                  }}
                >
                  {emotion.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: emotion.color }}>
                    {emotion.name}
                  </h3>
                  <p className="text-xs text-gray-400">{emotion.nameEn}</p>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 block">記憶標題</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="今天發生了什麼讓你開心的事？"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 transition-colors"
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 block">記憶內容</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="寫下你的感受與回憶..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 transition-colors resize-none"
                />
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 block">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-gray-300 transition-colors"
                />
              </div>

              {/* Intensity */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  情緒強度 <span className="ml-2 text-lg font-bold" style={{ color: emotion.color }}>{intensity}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full mt-2"
                  style={{
                    accentColor: emotion.color,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>微弱</span>
                  <span>強烈</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  分類（可多選）
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <motion.button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedCategories.includes(cat.id)
                          ? 'text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                      style={
                        selectedCategories.includes(cat.id)
                          ? { backgroundColor: cat.color, boxShadow: `0 4px 12px ${cat.color}44` }
                          : {}
                      }
                    >
                      {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${emotion.color}, ${emotion.color}CC)`,
                  boxShadow: `0 8px 24px ${emotion.color}44`,
                }}
              >
                <Heart size={18} />
                收藏記憶球
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreateMemoryModal
