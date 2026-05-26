import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart,
} from 'recharts'
import { emotions, getEmotionById } from '../data/emotions'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns'
import { zhTW } from 'date-fns/locale'

const StatsPage = ({ memories }) => {
  const [timeRange, setTimeRange] = useState('month') // week, month, year

  const stats = useMemo(() => {
    const now = new Date()
    let startDate
    if (timeRange === 'week') startDate = subDays(now, 7)
    else if (timeRange === 'month') startDate = subDays(now, 30)
    else startDate = subDays(now, 365)

    const filtered = memories.filter(m => {
      try {
        const d = parseISO(m.date)
        return isWithinInterval(d, { start: startDate, end: now })
      } catch { return false }
    })

    // Emotion counts
    const emotionCounts = {}
    emotions.forEach(e => { emotionCounts[e.id] = 0 })
    filtered.forEach(m => {
      if (emotionCounts[m.emotion] !== undefined) emotionCounts[m.emotion]++
    })

    // Pie data
    const pieData = emotions.map(e => ({
      name: e.name,
      value: emotionCounts[e.id],
      color: e.color,
    })).filter(d => d.value > 0)

    // Average intensity
    const totalIntensity = filtered.reduce((sum, m) => sum + (m.intensity || 5), 0)
    const avgIntensity = filtered.length > 0 ? (totalIntensity / filtered.length).toFixed(1) : 0

    // Most common emotion
    const sorted = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])
    const mostCommon = sorted[0] && sorted[0][1] > 0 ? sorted[0][0] : null

    // Trend data (daily intensity average)
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12
    const trendData = []

    if (timeRange === 'year') {
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
        const monthMemories = filtered.filter(m => {
          try {
            const d = parseISO(m.date)
            return isWithinInterval(d, { start: monthStart, end: monthEnd })
          } catch { return false }
        })
        const avg = monthMemories.length > 0
          ? monthMemories.reduce((s, m) => s + (m.intensity || 5), 0) / monthMemories.length
          : 0
        trendData.push({
          label: format(monthStart, 'M月'),
          value: Number(avg.toFixed(1)),
          count: monthMemories.length,
        })
      }
    } else {
      for (let i = days - 1; i >= 0; i--) {
        const day = subDays(now, i)
        const dayStr = format(day, 'yyyy-MM-dd')
        const dayMemories = filtered.filter(m => m.date === dayStr)
        const avg = dayMemories.length > 0
          ? dayMemories.reduce((s, m) => s + (m.intensity || 5), 0) / dayMemories.length
          : 0
        trendData.push({
          label: format(day, 'MM/dd'),
          value: Number(avg.toFixed(1)),
          count: dayMemories.length,
        })
      }
    }

    return {
      total: filtered.length,
      pieData,
      avgIntensity,
      mostCommon,
      emotionCounts,
      trendData,
    }
  }, [memories, timeRange])

  const mostCommonEmotion = stats.mostCommon ? getEmotionById(stats.mostCommon) : null

  return (
    <div className="h-full overflow-y-auto pb-4 px-4 pt-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">情緒統計</h2>
        <div className="flex items-center gap-1 p-1 glass rounded-xl">
          {[
            { id: 'week', label: '週' },
            { id: 'month', label: '月' },
            { id: 'year', label: '年' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === t.id
                  ? 'bg-purple-500/40 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {memories.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl mb-4">📊</div>
          <p className="text-white/40 text-sm text-center">
            還沒有記憶數據<br />開始記錄情緒後就能看到統計
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Overview cards */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="glass rounded-2xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-white/50 text-xs mb-1">情緒記錄</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{stats.total}</span>
                <span className="text-white/40 text-xs mb-1">筆記憶</span>
              </div>
            </motion.div>

            <motion.div
              className="glass rounded-2xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white/50 text-xs mb-1">平均強度</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{stats.avgIntensity}</span>
                <span className="text-white/40 text-xs mb-1">/10</span>
              </div>
            </motion.div>
          </div>

          {/* Emotion pie chart */}
          <motion.div
            className="glass rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-white/80 mb-3">情緒比例</h3>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {emotions.map(e => {
                  const count = stats.emotionCounts[e.id] || 0
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  return (
                    <div key={e.id} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                      <span className="text-xs text-white/70 flex-1">{e.name}</span>
                      <span className="text-xs text-white/50">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Most common emotion */}
          {mostCommonEmotion && (
            <motion.div
              className="glass rounded-2xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-medium text-white/80 mb-2">最常出現情緒</h3>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `radial-gradient(circle, ${mostCommonEmotion.color}44, ${mostCommonEmotion.color}22)`,
                    boxShadow: `0 0 15px ${mostCommonEmotion.color}33`,
                  }}
                >
                  {mostCommonEmotion.emoji}
                </div>
                <div>
                  <p className="text-white font-medium">{mostCommonEmotion.name}</p>
                  <p className="text-white/40 text-xs">
                    出現 {stats.emotionCounts[mostCommonEmotion.id]} 次
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trend chart */}
          <motion.div
            className="glass rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-medium text-white/80 mb-3">情緒趨勢</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9B59B6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,15,46,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9B59B6"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default StatsPage
