import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'emotion-memory-data'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToStorage = (memories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export const useMemoryStore = () => {
  const [memories, setMemories] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(memories)
  }, [memories])

  const addMemory = useCallback((memory) => {
    const newMemory = {
      ...memory,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
    }
    setMemories(prev => [newMemory, ...prev])
    return newMemory
  }, [])

  const updateMemory = useCallback((id, updates) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }, [])

  const deleteMemory = useCallback((id) => {
    setMemories(prev => prev.filter(m => m.id !== id))
  }, [])

  const getMemoriesByDate = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0]
    return memories.filter(m => m.date === dateStr)
  }, [memories])

  const getMemoriesByEmotion = useCallback((emotionId) => {
    if (!emotionId || emotionId === 'all') return memories
    return memories.filter(m => m.emotion === emotionId)
  }, [memories])

  const getStats = useCallback(() => {
    const total = memories.length
    const emotionCounts = {}
    let totalIntensity = 0

    memories.forEach(m => {
      emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1
      totalIntensity += m.intensity || 5
    })

    const avgIntensity = total > 0 ? (totalIntensity / total).toFixed(1) : 0
    const mostCommon = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      total,
      emotionCounts,
      avgIntensity,
      mostCommon: mostCommon ? mostCommon[0] : null,
    }
  }, [memories])

  return {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    getMemoriesByDate,
    getMemoriesByEmotion,
    getStats,
  }
}
