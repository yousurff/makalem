import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [hata, setHata] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setHata(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Giriş başarılıysa admin paneline yönlendir
      navigate('/admin')
    } catch (err) {
      setHata('Giriş başarısız: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full space-y-8 bg-[#faf7f2] p-10 rounded-xl shadow-lg border-2 border-stone-300 relative overflow-hidden">
        {/* Dekoratif şerit */}
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-900"></div>

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-amber-950 font-serif">
            Yönetici Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Kütüphane arşivine erişim için kimliğinizi doğrulayın.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">E-posta Adresi</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-900 focus:border-amber-900 focus:z-10 sm:text-sm bg-stone-50"
                placeholder="E-posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-900 focus:border-amber-900 focus:z-10 sm:text-sm bg-stone-50"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {hata && (
            <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded text-sm text-center font-medium">
              {hata}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-amber-50 bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-900 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}