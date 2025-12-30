import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-[#faf7f2] border-b border-stone-300 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* LOGO KISMI: Tamamen küçük harf ve Times New Roman */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-amber-900 text-amber-50 p-2 rounded-lg group-hover:bg-amber-800 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              {/* 'makalem' yazısı küçük harflerle */}
              <span className="text-4xl font-bold text-amber-900 tracking-tight group-hover:text-amber-800 transition-colors pb-1">
                makalem
              </span>
            </Link>

            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 h-full">
              <Link to="/" className="text-stone-700 hover:text-amber-900 inline-flex items-center px-1 pt-1 border-b-4 border-transparent hover:border-amber-800 text-xl font-bold transition-colors">
                Anasayfa
              </Link>
              <Link to="/search" className="text-stone-600 hover:text-amber-900 inline-flex items-center px-1 pt-1 border-b-4 border-transparent hover:border-amber-800 text-xl font-bold transition-colors">
                Detaylı Arama
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/submit" className="inline-flex items-center px-5 py-2.5 border border-amber-900 text-lg font-bold rounded text-amber-50 bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-colors shadow-sm">
              Tez Gönder
            </Link>
            <Link to="/login" className="text-stone-700 hover:text-amber-900 px-3 py-2 rounded-md text-xl font-bold">
              Giriş
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}