import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, LogOut } from 'lucide-react'
import ScrollToBottom from 'react-scroll-to-bottom'

const STORAGE_KEY = 'chat_user'

function logout(setUser) {
  localStorage.removeItem(STORAGE_KEY)
  setUser(null)
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001')

const socket = io(SOCKET_URL, { autoConnect: true })

export default function Chat({ user, setUser }) {
  const username = user?.name || 'Anónimo'
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(socket.connected)
  const queryClient = useQueryClient()

  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: () => [],
    staleTime: Infinity,
  })

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('chat_messages', (msgs) => {
      queryClient.setQueryData(['messages'], msgs)
    })
    socket.on('chat_message', (newMsg) => {
      queryClient.setQueryData(['messages'], (prev = []) => [...prev, newMsg])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('chat_messages')
      socket.off('chat_message')
    }
  }, [queryClient])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const msg = { text: input, user: username, time: Date.now() }
    socket.emit('chat_message', msg)
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-2 shadow-sm shrink-0">
        <span className={`w-3 h-3 rounded-full transition-colors ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <h1 className="text-lg font-semibold text-gray-800">Chat en vivo</h1>
        {!connected && <span className="text-xs text-red-500">Desconectado</span>}
        <span className="text-xs text-gray-500 ml-auto">{username}</span>
        <button
          type="button"
          onClick={() => logout(setUser)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </header>

      <ScrollToBottom className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.time + i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.user === username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.user === username
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.user !== username && (
                    <span className="text-[11px] font-semibold opacity-80 block mb-0.5">{msg.user}</span>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {new Date(msg.time).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollToBottom>

      <form
        onSubmit={sendMessage}
        className="border-t bg-white px-4 py-3 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
