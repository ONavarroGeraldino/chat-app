import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const STORAGE_KEY = 'chat_user'

export default function Auth({ onLogin }) {
  const [nombre, setNombre] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: nombre.trim() }))
    onLogin({ name: nombre.trim() })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white rounded-full p-3 mb-3">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Chat en vivo</h1>
          <p className="text-sm text-gray-500 mt-1">Escribe tu nombre para entrar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Entrar al chat
          </button>
        </form>
      </div>
    </div>
  )
}
