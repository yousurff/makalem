import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate('/admin')
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-[#faf7f2] p-8 rounded-xl shadow-xl border-2 border-stone-300 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-amber-950 font-serif">Admin Login</h1>
          <p className="text-stone-600">Please sign in to manage the system.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-3 text-red-800">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border-2 border-stone-300 rounded-lg p-3 focus:ring-amber-900 focus:border-amber-900 outline-none transition"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full border-2 border-stone-300 rounded-lg p-3 focus:ring-amber-900 focus:border-amber-900 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}