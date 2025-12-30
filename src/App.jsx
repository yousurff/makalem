// src/App.jsx - KİTAP GÖRÜNÜMLÜ HALİ
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import SubmitThesis from './pages/SubmitThesis'
import ThesisDetail from './pages/ThesisDetail'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUniversity from './pages/admin/ManageUniversity'
import ManageInstitute from './pages/admin/ManageInstitute'
import ManagePerson from './pages/admin/ManagePerson'
import ManageLanguage from './pages/admin/ManageLanguage'
import ManageTheses from './pages/admin/ManageTheses'
import EditThesis from './pages/admin/EditThesis'
import wallpaperBg from './assets/wallpaper.png'


function App() {
  return (
    <Router>
      {/* ANA KONTEYNER DEĞİŞİKLİKLİKLERİ:
          1. font-serif: Kitap gibi tırnaklı yazı tipi.
          2. bg-stone-900: Resim yüklenmezse koyu kahve zemin.
          3. style={{ backgroundImage... }}: Arka plan görseli.
      */}
      <div 
        className="min-h-screen text-stone-900 font-serif relative bg-stone-800"
        style={{
          backgroundImage: `url(${wallpaperBg})`,
          backgroundRepeat: 'repeat', // Desen tekrar etsin
          backgroundSize: 'auto',     // Orijinal boyutunda kalsın (veya 'cover' yapabilirsiniz)
          backgroundBlendMode: 'multiply' // Renkle görseli harmanla
        }}
      >
        {/* Arka planın üzerine hafif bir sepya/kahve katman atıyoruz ki yazılar okunsun */}
        <div className="absolute inset-0 bg-[#f5efe6]/30 pointer-events-none"></div>

        {/* İçerik bu katmanın üzerinde olacak */}
        <div className="relative z-10">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shadow-xl my-8 bg-[#faf7f2] rounded-xl border border-stone-300 mx-4 md:mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/submit" element={<SubmitThesis />} />
              <Route path="/thesis/:id" element={<ThesisDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/universities" element={<ManageUniversity />} />
              <Route path="/admin/institutes" element={<ManageInstitute />} />
              <Route path="/admin/people" element={<ManagePerson />} />
              <Route path="/admin/languages" element={<ManageLanguage />} /> 
              <Route path="/admin/theses" element={<ManageTheses />} />
              <Route path="/admin/edit-thesis/:id" element={<EditThesis />} />
            </Routes>
          </main>
          {/* Alt kısım boşluğu */}
          <div className="h-12"></div>
        </div>
      </div>
    </Router>
  )
}

export default App