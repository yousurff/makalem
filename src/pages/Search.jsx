// src/pages/Search.jsx - KİTAP GÖRÜNÜMLÜ HALİ
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Search() {
  const [tezler, setTezler] = useState([])
  const [aramaMetni, setAramaMetni] = useState('')
  const [dilFiltresi, setDilFiltresi] = useState('Hepsi')
  const [turFiltresi, setTurFiltresi] = useState('Hepsi')
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data, error } = await supabase
          .from('thesis')
          .select(`*, author:person!author_id(first_name, last_name), language:language(language_name), institute:institute(institute_name, university:university(university_name))`)
          .eq('approval_status', 'published')

        if (error) throw error
        setTezler(data)
      } catch (error) {
        console.error('Veri çekme hatası:', error)
      } finally {
        setYukleniyor(false)
      }
    }
    verileriGetir()
  }, [])

  const filtrelenmisTezler = tezler.filter((tez) => {
    const metinUygun = tez.title.toLowerCase().includes(aramaMetni.toLowerCase()) || tez.abstract.toLowerCase().includes(aramaMetni.toLowerCase())
    const dilUygun = dilFiltresi === 'Hepsi' || tez.language?.language_name === dilFiltresi
    const turUygun = turFiltresi === 'Hepsi' || tez.type === turFiltresi
    return metinUygun && dilUygun && turUygun
  })

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      
      {/* SOL TARAF: Filtre Paneli - Kütüphane Rafı Görünümü */}
      <aside className="w-full md:w-72 flex-shrink-0">
        {/* bg-white yerine bg-[#faf7f2] ve koyu çerçeve */}
        <div className="bg-[#faf7f2] p-6 rounded-xl shadow-md border-2 border-stone-400 sticky top-28">
          <h2 className="text-xl font-bold text-amber-950 mb-6 border-b-2 border-stone-300 pb-2">Koleksiyon Filtreleri</h2>
          
          <div className="space-y-6">
            {/* Input alanları beyaz değil, koyu krem (bg-stone-100) */}
            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Arama</label>
              <input
                type="text"
                placeholder="Başlık veya özet içinde..."
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm focus:ring-amber-900 focus:border-amber-900 p-3 text-stone-900 font-medium placeholder-stone-500"
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Tez Türü</label>
              <select 
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm p-3 text-stone-900 font-medium focus:ring-amber-900 focus:border-amber-900"
                value={turFiltresi}
                onChange={(e) => setTurFiltresi(e.target.value)}
              >
                <option value="Hepsi">Tüm Türler</option>
                <option value="Master">Yüksek Lisans</option>
                <option value="PhD">Doktora</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Dil</label>
              <select 
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm p-3 text-stone-900 font-medium focus:ring-amber-900 focus:border-amber-900"
                value={dilFiltresi}
                onChange={(e) => setDilFiltresi(e.target.value)}
              >
                <option value="Hepsi">Tüm Diller</option>
                <option value="Türkçe">Türkçe</option>
                <option value="English">English</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Français">Français</option>
              </select>
            </div>
            
            <div className="text-sm font-semibold text-stone-600 pt-6 border-t-2 border-stone-300">
              Bu rafta <strong>{filtrelenmisTezler.length}</strong> eser bulundu.
            </div>
          </div>
        </div>
      </aside>

      {/* SAĞ TARAF: Sonuç Listesi */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-amber-950 mb-8 border-b-2 border-stone-300 pb-4">Kütüphane Arşivi</h1>

        {yukleniyor ? (
          <div className="text-center py-20 text-amber-900 font-bold text-xl">Raflar taranıyor...</div>
        ) : filtrelenmisTezler.length === 0 ? (
          <div className="bg-[#faf7f2] p-12 rounded-xl shadow-sm text-center text-stone-600 border-2 border-dashed border-stone-400 font-medium text-lg">
            Aradığınız kriterlere uygun eser bu rafta yok.
          </div>
        ) : (
          <div className="space-y-6">
            {filtrelenmisTezler.map((tez) => (
              <Link 
                to={`/thesis/${tez.thesis_no}`} 
                key={tez.thesis_no} 
                // Kartlar beyaz yerine kağıt rengi
                className="block bg-[#faf7f2] p-8 rounded-xl shadow-sm border-2 border-stone-300 hover:border-amber-800 hover:shadow-xl transition-all duration-300 group relative"
              >
                {/* Sol tarafta dekoratif bir "cilt" şeridi */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-900/20 rounded-l-xl group-hover:bg-amber-900/40 transition-colors"></div>
                
                <div className="pl-4 flex justify-between items-start">
                  <div className="flex-1">
                     <div className="flex gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${tez.type === 'PhD' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-200 text-stone-800 border-stone-400'}`}>
                          {tez.type}
                        </span>
                        <span className="text-stone-600 font-semibold bg-stone-200 px-2 py-1 rounded text-sm border border-stone-300">{tez.year}</span>
                     </div>
                    <h3 className="text-2xl font-bold text-amber-950 group-hover:text-amber-800 transition-colors leading-snug">
                      {tez.title}
                    </h3>
                  </div>
                </div>

                <div className="pl-4 mt-4 text-base text-stone-700 font-medium">
                  <span className="text-stone-900 font-bold">{tez.author?.first_name} {tez.author?.last_name}</span> 
                  <span className="mx-3 text-amber-800/50 font-bold">•</span>
                  <span className="italic">{tez.institute?.university?.university_name}</span>
                </div>

                <p className="pl-4 mt-4 text-stone-700 text-base line-clamp-2 italic leading-relaxed">
                  {tez.abstract}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}