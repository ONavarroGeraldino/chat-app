import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, LogOut, Smile } from 'lucide-react'
import ScrollToBottom from 'react-scroll-to-bottom'

const STORAGE_KEY = 'chat_user'

function logout(setUser) {
  localStorage.removeItem(STORAGE_KEY)
  setUser(null)
}

const EMOJIS = [
  '😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','😉','😌','😍','🥰','😘','😗',
  '😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫣','🤫','🤔','😐','😑','😶','😏','😒',
  '🙄','😬','😮','😯','😲','😳','🥺','😢','😭','😤','😡','🤬','😈','👿','💀','☠️',
  '💩','🤡','👹','👺','👻','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀',
  '😿','😾','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓',
  '💗','💖','💘','💝','💟','👍','👎','👊','✊','🤛','🤜','👏','🙌','👐','🤲','🤝',
  '🙏','✌️','🤟','🤘','👌','🤌','🤏','🫰','🫵','🫶','💪','🦵','🦶','👀','👁️','👅',
  '👄','🎉','🎊','🎈','🎁','🎀','🪄','✨','🌟','⭐','🌙','☀️','🌈','☁️','⚡','🔥',
  '💧','🌊','🌸','🌺','🌻','🌹','🌷','🌼','🌱','🌿','🍀','🍄','🐶','🐱','🐭','🐹',
  '🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦄','🐴',
  '🍕','🍔','🌮','🌯','🥗','🍜','🍣','🍩','🍪','🧁','🍰','🎂','🍦','🍫','🍿','🥤',
  '⚽','🏀','🎾','🏈','⚾','🎱','🏓','🏸','🏒','🥊','🎮','🎯','🎲','♟️','🧩','🎵',
  '🎶','🎤','🎧','🎸','🎹','🥁','🎷','🎺','🎻','📱','💻','⌚','📷','🎥','📸','🔮',
]

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001')
const MESSAGES_CACHE_KEY = 'chat_messages'

let cachedMessages = []
try {
  const stored = localStorage.getItem(MESSAGES_CACHE_KEY)
  if (stored) cachedMessages = JSON.parse(stored)
} catch {}

let globalSetConnected = null
let globalSetMessages = null

const socket = io(SOCKET_URL, { autoConnect: true })

socket.on('connect', () => globalSetConnected?.(true))
socket.on('disconnect', () => globalSetConnected?.(false))
socket.on('chat_messages', (msgs) => {
  localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(msgs))
  globalSetMessages?.(msgs)
})
socket.on('chat_message', (newMsg) => {
  globalSetMessages?.((prev) => {
    const next = [...prev, newMsg]
    localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(next))
    return next
  })
})

export default function Chat({ user, setUser }) {
  const username = user?.name || 'Anónimo'
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(socket.connected)
  const [showEmojis, setShowEmojis] = useState(false)
  const [messages, setMessages] = useState(cachedMessages)
  const emojiRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    globalSetConnected = setConnected
    globalSetMessages = setMessages
    return () => {
      globalSetConnected = null
      globalSetMessages = null
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojis(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const msg = { text: input, user: username, time: Date.now() }
    socket.emit('chat_message', msg)
    setInput('')
    setShowEmojis(false)
  }

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  const avatarColor = (name) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500']
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${connected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400'}`} />
          <h1 className="text-lg font-bold text-white">Chat en vivo</h1>
        </div>
        {!connected && <span className="text-xs text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full">Desconectado</span>}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-full pl-3 pr-4 py-1.5">
            <div className={`w-6 h-6 rounded-full ${avatarColor(username)} flex items-center justify-center text-white text-xs font-bold`}>
              {username[0].toUpperCase()}
            </div>
            <span className="text-xs text-white/80 font-medium">{username}</span>
          </div>
          <button
            type="button"
            onClick={() => logout(setUser)}
            className="text-white/50 hover:text-red-400 transition-colors p-1.5 hover:bg-white/10 rounded-full"
            title="Salir"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <ScrollToBottom className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMine = msg.user === username
            return (
              <motion.div
                key={msg.time + i}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full ${avatarColor(msg.user)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg`}>
                  {msg.user[0].toUpperCase()}
                </div>
                <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMine && (
                    <span className="text-[11px] text-white/50 font-medium mb-1 ml-1">{msg.user}</span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-lg ${
                      isMine
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white/10 backdrop-blur-md text-white/90 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block ${isMine ? 'text-blue-200' : 'text-white/40'}`}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </ScrollToBottom>

      <div className="border-t border-white/10 bg-white/5 backdrop-blur-lg px-4 py-3 shrink-0">
        <form onSubmit={sendMessage} className="flex items-center gap-2 relative">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full rounded-full bg-white/10 border border-white/10 px-5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full p-2.5 transition-all"
            >
              <Smile size={18} />
            </button>
            {showEmojis && (
              <div className="absolute bottom-14 right-0 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-3 w-72 h-64 overflow-y-auto grid grid-cols-8 gap-1 z-50">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="hover:bg-white/10 rounded-lg p-1.5 text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-2.5 hover:from-blue-600 hover:to-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
