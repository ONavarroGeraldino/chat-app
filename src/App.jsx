import { useUser } from './hooks/useUser'
import Chat from './components/Chat'
import Auth from './components/Auth'

export default function App() {
  const { user, loading, setUser } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return user ? <Chat user={user} setUser={setUser} /> : <Auth onLogin={setUser} />
}
