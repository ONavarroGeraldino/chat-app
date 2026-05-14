import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chat_user'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem(STORAGE_KEY) }
    }
    setLoading(false)
  }, [])

  return { user, loading, setUser }
}
