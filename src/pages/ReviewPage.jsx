import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Share2, Download } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { getEmotionById, getRandomQuote, emotions } from '../data/emotions'
import html2canvas from 'html2canvas'

const ReviewPage = ({ memories }) => {
  const cardRef = useRef(null)

  const todayData = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayMemories = memories.filter(m => m.date === today)

    if (todayMemories.length === 0) return null

    // Dominant emotion
    const counts = {}
    todayMemories.forEach(m => { counts[m.emotion] = (counts[m.emotion] || 0) + 1 })
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const dominantEmotion = dominant ? getEmotionById(dominant[0]) : null

    // Average intensity
    const avgIntensity = (todayMemories.reduce((s, m) => s + (m.intensity || 5), 0) / todayMemories.length).toFixed(1)

    // Quote
    const quote = dominantEmotion ? getRandomQuote(dominantEmotion.id) : getRandomQuote('all')

    return {
      memories: todayMemories,
      dominantEmotion,
      avgIntensity,
      quote,
      count: todayMemories.length,
    }
  }, [memories])

  const handleExportStory = async () => {
    if (!cardRef.current) return
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 3,
        width: 390,
        height: 693,
      })
      const link = document.createElement('a')
      link.download = `emotion-review-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  const handleShare = async () => {
    if (!todayData) return
    const text = `今日情緒回顧\n\n${todayData.dominantEmotion?.emoji} 主要情緒：${todayData.dominantEmotion?.name}\n情緒強度：${todayData.avgIntensity}/10\n\n「${todayData.quote?.text}」\n\n— Emotion Memory`
    if (navigator.share) {
      try { await navigator.share({ text }) } catch {}
    } else {
      navigator.clipboard.writeText(text)
      alert('已複製到剪貼板！')
    }
  }

  const today = new Date()

  return (
    <div className="h-full overflow-y-auto pb-4 px-4 pt-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">今日回顧</h2>
        <p className="text-white/40 text-xs">
          {format(today, 'M月d日，EEEE', { locale: zhTW })}
        </p>
      </motion.div>

      {!todayData ? (
        <motion.div
          className="flex flex-col items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <p className="text-white/40 text-sm text-center mb-2">今天還沒有情緒記錄</p>
          <p className="text-white/30 text-xs text-center">
            記錄今天的第一個情緒<br />回來看看你的每日回顧吧
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Main review card */}
          <motion.div
            ref={cardRef}
            className="glass rounded-3xl p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${todayData.dominantEmotion?.color || '#9B59B6'} 0%, transparent 70%)`,
              }}
            />

            {/* Title */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-yellow-400" />
                <span className="text-white/60 text-sm">今天的你</span>
              </div>

              {/* Dominant emotion */}
              <div className="flex flex-col items-center mb-6">
                <p className="text-white/60 text-xs mb-3">你的主要情緒是</p>
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${todayData.dominantEmotion?.color}88, ${todayData.dominantEmotion?.color}44)`,
                    boxShadow: `0 0 30px ${todayData.dominantEmotion?.color}44`,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-3xl">{todayData.dominantEmotion?.emoji}</span>
                </motion.div>
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ color: todayData.dominantEmotion?.color }}
                >
                  {todayData.dominantEmotion?.name}
                </h3>
                <p className="text-white/40 text-xs">{todayData.dominantEmotion?.nameEn}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-white/50 text-xs mb-1">情緒強度</p>
                  <p className="text-xl font-bold" style={{ color: todayData.dominantEmotion?.color }}>
                    {todayData.avgIntensity}<span className="text-sm text-white/40">/10</span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-white/50 text-xs mb-1">記錄次數</p>
                  <p className="text-xl font-bold text-white">
                    {todayData.count}<span className="text-sm text-white/40">次</span>
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-white/50 text-xs mb-2">今日語錄</p>
                <p className="text-white/90 text-sm leading-relaxed italic">
                  「{todayData.quote?.text}」
                </p>
              </div>
            </div>
          </motion.div>

          {/* Today's memories list */}
          <motion.div
            className="glass rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-medium text-white/80 mb-3">今日記憶</h4>
            <div className="space-y-2">
              {todayData.memories.map(memory => {
                const emotion = getEmotionById(memory.emotion)
                return (
                  <div
                    key={memory.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
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
                      <p className="text-white/80 text-sm truncate">{memory.title}</p>
                      <p className="text-white/40 text-xs">{emotion.name} · {memory.intensity}/10</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl glass flex items-center justify-center gap-2 text-white/70 text-sm"
            >
              <Share2 size={16} />
              分享今日心情
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExportStory}
              className="flex-1 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center gap-2 text-purple-300 text-sm font-medium"
            >
              <Download size={16} />
              匯出 IG Story
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ReviewPage
