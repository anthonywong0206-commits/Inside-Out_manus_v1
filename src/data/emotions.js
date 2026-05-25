export const emotions = [
  {
    id: 'joy',
    name: '喜悅',
    nameEn: 'Joy',
    color: '#FFD700',
    bgGradient: 'from-yellow-400 to-amber-500',
    emoji: '😊',
    description: '溫暖的光芒',
  },
  {
    id: 'anger',
    name: '憤怒',
    nameEn: 'Anger',
    color: '#FF4444',
    bgGradient: 'from-red-500 to-orange-600',
    emoji: '😠',
    description: '燃燒的火焰',
  },
  {
    id: 'sadness',
    name: '悲傷',
    nameEn: 'Sadness',
    color: '#4A90D9',
    bgGradient: 'from-blue-400 to-blue-600',
    emoji: '😢',
    description: '安靜的水滴',
  },
  {
    id: 'fear',
    name: '恐懼',
    nameEn: 'Fear',
    color: '#9B59B6',
    bgGradient: 'from-purple-500 to-violet-700',
    emoji: '😨',
    description: '顫抖的暗影',
  },
  {
    id: 'disgust',
    name: '厭惡',
    nameEn: 'Disgust',
    color: '#2ECC71',
    bgGradient: 'from-green-400 to-emerald-600',
    emoji: '😤',
    description: '高傲的姿態',
  },
]

export const categories = [
  { id: 'family', name: '家庭', color: '#FF9F43' },
  { id: 'friends', name: '朋友', color: '#54A0FF' },
  { id: 'love', name: '愛情', color: '#FF6B6B' },
  { id: 'career', name: '事業', color: '#5F27CD' },
  { id: 'money', name: '金錢', color: '#10AC84' },
  { id: 'hobby', name: '興趣', color: '#EE5A24' },
  { id: 'health', name: '健康', color: '#0ABDE3' },
  { id: 'growth', name: '成長', color: '#F368E0' },
  { id: 'study', name: '學業', color: '#48DBFB' },
  { id: 'dream', name: '夢想', color: '#C44569' },
]

export const quotes = [
  { text: '快樂不是擁有更多，而是珍惜已有的一切。', emotion: 'joy' },
  { text: '每一個微笑，都是心靈的陽光。', emotion: 'joy' },
  { text: '幸福就在每一個平凡的瞬間裡。', emotion: 'joy' },
  { text: '感恩讓快樂加倍，分享讓幸福延續。', emotion: 'joy' },
  { text: '今天的快樂，是明天最美的回憶。', emotion: 'joy' },
  { text: '憤怒是一封寫給自己的信，讀完就放下吧。', emotion: 'anger' },
  { text: '深呼吸，讓風帶走所有的不平。', emotion: 'anger' },
  { text: '憤怒告訴我們界限在哪裡。', emotion: 'anger' },
  { text: '學會表達憤怒，而不是被憤怒表達。', emotion: 'anger' },
  { text: '悲傷是心靈在下雨，雨後會有彩虹。', emotion: 'sadness' },
  { text: '允許自己悲傷，是勇敢的表現。', emotion: 'sadness' },
  { text: '眼淚是心靈的清洗劑。', emotion: 'sadness' },
  { text: '悲傷讓我們更懂得珍惜快樂。', emotion: 'sadness' },
  { text: '恐懼是成長的前奏曲。', emotion: 'fear' },
  { text: '勇氣不是沒有恐懼，而是帶著恐懼前行。', emotion: 'fear' },
  { text: '每一次面對恐懼，都讓我們更強大。', emotion: 'fear' },
  { text: '厭惡幫助我們認清什麼是重要的。', emotion: 'disgust' },
  { text: '有所不喜，才能有所堅持。', emotion: 'disgust' },
  { text: '每一種情緒都有它存在的意義。', emotion: 'all' },
  { text: '情緒是心靈的語言，值得被傾聽。', emotion: 'all' },
  { text: '記錄情緒，是與自己對話的開始。', emotion: 'all' },
  { text: '所有的感受都值得被溫柔對待。', emotion: 'all' },
]

export const getEmotionById = (id) => {
  return emotions.find(e => e.id === id) || emotions[0]
}

export const getRandomQuote = (emotionId) => {
  const filtered = quotes.filter(q => q.emotion === emotionId || q.emotion === 'all')
  return filtered[Math.floor(Math.random() * filtered.length)]
}
