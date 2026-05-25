import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Trash2, Share2, Download, Star } from 'lucide-react'
import { getEmotionById, categories } from '../data/emotions'
import html2canvas from 'html2canvas'
import { useRef } from 'react'

const MemoryDetail = ({ memory, isOpen, onClose, onDelete, onEdit }) => {
  const cardRef = useRef(null)

  if (!memory) return null

  const emotion = getEmotionById(memory.emotion)

  const handleExport = async () => {
    if (!cardRef.current) return
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `emotion-memory-${memory.id}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  const handleShare = async () => {
    const text = `${emotion.emoji} ${emotion.name}\n\n${memory.title}\n\n${memory.content}\n\n情緒強度：${memory.intensity}/10\n\n— Emotion Memory`
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {}
    } else {
      navigator.clipboard.writeText(text)
      alert('已複製到剪貼板！')
    }
  }

  const getCategoryNames = () => {
    if (!memory.categories || memory.categories.length === 0) return []
    return memory.categories.map(catId => categories.find(c => c.id === catId)).filter(Boolean)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl glass-strong p-6"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={16} className="text-white/70" />
            </button>

            {/* Export card content */}
            <div ref={cardRef} className="space-y-4">
              {/* Emotion ball */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${emotion.color}88, ${emotion.color}44, ${emotion.color}22)`,
                    boxShadow: `0 0 30px ${emotion.color}44, 0 0 60px ${emotion.color}22`,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="absolute top-2 left-4 w-1/3 h-1/3 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
                  />
                  <span className="text-3xl relative z-10">{emotion.emoji}</span>
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center">
                <p className="text-white/60 text-xs mb-1">{memory.title}</p>
              </div>

              {/* Emotion info */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold" style={{ color: emotion.color }}>
                  {emotion.name}
                </span>
                <span className="text-white/40 text-sm">{emotion.nameEn}</span>
              </div>

              {/* Date */}
              <p className="text-center text-white/40 text-xs">{memory.date}</p>

              {/* Content */}
              {memory.content && (
                <div className="bg-white/5 rounded-2xl p-4 mt-4">
                  <p className="text-white/80 text-sm leading-relaxed">{memory.content}</p>
                </div>
              )}

              {/* Intensity */}
              <div className="flex items-center gap-2 justify-center mt-3">
                <span className="text-white/60 text-sm">情緒強度</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < memory.intensity ? 'fill-current' : 'opacity-20'}
                      style={{ color: i < memory.intensity ? emotion.color : '#fff' }}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold" style={{ color: emotion.color }}>
                  {memory.intensity}/10
                </span>
              </div>

              {/* Categories */}
              {getCategoryNames().length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {getCategoryNames().map(cat => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${cat.color}22`,
                        color: cat.color,
                        border: `1px solid ${cat.color}44`,
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-white/10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit && onEdit(memory)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Edit3 size={18} className="text-blue-400" />
                <span className="text-[10px] text-white/60">編輯</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Share2 size={18} className="text-green-400" />
                <span className="text-[10px] text-white/60">分享</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleExport}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Download size={18} className="text-purple-400" />
                <span className="text-[10px] text-white/60">匯出</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { onDelete(memory.id); onClose() }}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={18} className="text-red-400" />
                <span className="text-[10px] text-white/60">刪除</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MemoryDetail
