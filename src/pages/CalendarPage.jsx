import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { getEmotionById } from '../data/emotions'
import MemoryDetail from '../components/MemoryDetail'

const CalendarPage = ({ memories, onDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedMemory, setSelectedMemory] = useState(null)

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    const startDayOfWeek = getDay(start)
    const paddedDays = Array(startDayOfWeek).fill(null).concat(days)
    return paddedDays
  }, [currentMonth])

  const getMemoriesForDate = (date) => {
    if (!date) return []
    const dateStr = format(date, 'yyyy-MM-dd')
    return memories.filter(m => m.date === dateStr)
  }

  const getDominantEmotion = (date) => {
    const dayMemories = getMemoriesForDate(date)
    if (dayMemories.length === 0) return null
    const counts = {}
    dayMemories.forEach(m => { counts[m.emotion] = (counts[m.emotion] || 0) + 1 })
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return dominant ? getEmotionById(dominant[0]) : null
  }

  const selectedDateMemories = selectedDate ? getMemoriesForDate(selectedDate) : []

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="h-full overflow-y-auto pb-4 px-4 pt-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">情緒日曆</h2>
      </motion.div>

      {/* Month navigation */}
      <motion.div
        className="glass rounded-2xl p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-white/70" />
          </motion.button>
          <h3 className="text-lg font-bold text-white">
            {format(currentMonth, 'yyyy年M月', { locale: zhTW })}
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
          >
            <ChevronRight size={18} className="text-white/70" />
          </motion.button>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-white/40 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="aspect-square" />

            const emotion = getDominantEmotion(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-purple-500/30 ring-1 ring-purple-400/50'
                    : isToday
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-white/70'}`}>
                  {format(day, 'd')}
                </span>
                {emotion && (
                  <div
                    className="w-4 h-4 rounded-full mt-0.5 flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${emotion.color}66, ${emotion.color}33)`,
                      boxShadow: `0 0 6px ${emotion.color}44`,
                    }}
                  >
                    <span className="text-[8px]">{emotion.emoji}</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Selected date memories */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl p-4"
          >
            <h4 className="text-sm font-medium text-white/80 mb-3">
              {format(selectedDate, 'M月d日', { locale: zhTW })}的情緒
            </h4>
            {selectedDateMemories.length === 0 ? (
              <p className="text-white/40 text-xs text-center py-4">這天還沒有記錄</p>
            ) : (
              <div className="space-y-2">
                {selectedDateMemories.map(memory => {
                  const emotion = getEmotionById(memory.emotion)
                  return (
                    <motion.button
                      key={memory.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMemory(memory)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle, ${emotion.color}44, ${emotion.color}22)`,
                        }}
                      >
                        <span className="text-sm">{emotion.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm font-medium truncate">{memory.title}</p>
                        <p className="text-white/40 text-xs truncate">{memory.content}</p>
                      </div>
                      <span className="text-xs font-medium" style={{ color: emotion.color }}>
                        {memory.intensity}/10
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory detail */}
      <MemoryDetail
        memory={selectedMemory}
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onDelete={onDelete}
      />
    </div>
  )
}

export default CalendarPage
