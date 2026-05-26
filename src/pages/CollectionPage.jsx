import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import MemoryBall from '../components/MemoryBall'
import MemoryDetail from '../components/MemoryDetail'
import { emotions, categories } from '../data/emotions'

const CollectionPage = ({ memories, onDelete, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [emotionFilter, setEmotionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)

  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchTitle = m.title?.toLowerCase().includes(q)
        const matchContent = m.content?.toLowerCase().includes(q)
        if (!matchTitle && !matchContent) return false
      }
      // Emotion filter
      if (emotionFilter !== 'all' && m.emotion !== emotionFilter) return false
      // Category filter
      if (categoryFilter.length > 0) {
        if (!m.categories || !m.categories.some(c => categoryFilter.includes(c))) return false
      }
      return true
    })
  }, [memories, searchQuery, emotionFilter, categoryFilter])

  const toggleCategoryFilter = (catId) => {
    setCategoryFilter(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setEmotionFilter('all')
    setCategoryFilter([])
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        className="px-4 pt-4 pb-2 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">我的情緒宇宙</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilter(!showFilter)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              showFilter ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            <Filter size={18} className="text-white/70" />
          </motion.button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋情緒、內容、分類..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass text-sm text-white placeholder-white/30 focus:bg-white/10 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-white/40" />
            </button>
          )}
        </div>

        {/* Emotion filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setEmotionFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              emotionFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/50'
            }`}
          >
            全部
          </motion.button>
          {emotions.map(e => (
            <motion.button
              key={e.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEmotionFilter(e.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                emotionFilter === e.id
                  ? 'text-white'
                  : 'bg-white/5 text-white/50'
              }`}
              style={emotionFilter === e.id ? { backgroundColor: `${e.color}33`, color: e.color } : {}}
            >
              <span>{e.emoji}</span>
              {e.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden flex-shrink-0"
          >
            <div className="glass rounded-2xl p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white/80">分類篩選</h4>
                {categoryFilter.length > 0 && (
                  <span className="text-xs text-white/40">已選 {categoryFilter.length} 項</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      categoryFilter.includes(cat.id)
                        ? 'text-white'
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}
                    style={
                      categoryFilter.includes(cat.id)
                        ? { backgroundColor: `${cat.color}44`, color: cat.color, border: `1px solid ${cat.color}66` }
                        : {}
                    }
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-white/60 text-sm"
                >
                  清除
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="flex-1 py-2 rounded-xl bg-purple-500/30 text-purple-300 text-sm font-medium"
                >
                  完成
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory balls universe */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredMemories.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌌
            </motion.div>
            <p className="text-white/40 text-sm text-center">
              {memories.length === 0
                ? '你的情緒宇宙還是空的\n去創建第一顆記憶球吧！'
                : '沒有找到符合條件的記憶'}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center py-4">
            {filteredMemories.map((memory, index) => (
              <MemoryBall
                key={memory.id}
                memory={memory}
                index={index}
                size={index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'medium'}
                onClick={setSelectedMemory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Memory detail modal */}
      <MemoryDetail
        memory={selectedMemory}
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onDelete={onDelete}
        onEdit={(m) => {
          setSelectedMemory(null)
        }}
      />
    </div>
  )
}

export default CollectionPage
