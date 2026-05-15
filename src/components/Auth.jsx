import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500']

export default function Auth({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    localStorage.setItem('chat_user', JSON.stringify({ name: nombre.trim() }))
    onLogin({ name: nombre.trim() })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`${color} text-white rounded-full p-3.5 mb-4 shadow-lg`}>
            <MessageCircle size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Chat en vivo</h1>
          <p className="text-sm text-white/50 mt-1.5">Escribe tu nombre para entrar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            required
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            Entrar al chat
          </button>
        </form>
      </motion.div>
    </div>
  )
}
