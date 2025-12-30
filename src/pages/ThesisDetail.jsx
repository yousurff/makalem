// src/pages/ThesisDetail.jsx - KİTAP GÖRÜNÜMLÜ HALİ
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, BookOpen } from 'lucide-react' // Kitap ikonu eklendi

export default function ThesisDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tez, setTez] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function detayGetir() {
      try {
        const { data, error } = await supabase
          .from('thesis')
          .select(`*, author:person!author_id(*), supervisor:person!supervisor_id(*), co_supervisor:person!co_supervisor_id(*), language:language(*), institute:institute(*, university:university(*)), thesis_keyword(keyword(*)), thesis_subject_topic(subject_topic(*))`)
          .eq('thesis_no', id)
          .single()

        if (error) throw error
        setTez(data)
      } catch (err) {
        console.error('Detay çekme hatası:', err)
      } finally {
        setYukleniyor(false)
      }
    }
    if (id) detayGetir()
  }, [id])

  if (yukleniyor) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-900 border-t-transparent"></div></div>
  if (!tez) return <div className="text-center p-20 text-amber-900 font-bold text-xl">Bu eser kütüphanede bulunamadı.</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center text-stone-700 hover:text-amber-900 mb-8 transition-colors font-bold text-lg"
      >
        <ArrowLeft className="w-6 h-6 mr-2 group-hover:-translate-x-2 transition-transform" />
        Raflara Geri Dön
      </button>

      {/* Ana Kitap Sayfası Konteyneri - Beyaz yok, parşömen rengi */}
      <div className="bg-[#faf7f2] shadow-2xl rounded-r-3xl rounded-l-md overflow-hidden border-2 border-stone-400 relative">
        {/* Sol tarafta cilt efekti */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-stone-500 to-[#faf7f2] opacity-20"></div>

        {/* Üst Başlık Kısmı - Koyu Kahve Degrade */}
        <div className="bg-gradient-to-r from-[#eaddc5] to-[#d6c7a8] p-10 border-b-4 border-amber-900/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 -mr-10 -mt-10">
            <BookOpen size={200} className="text-amber-950" />
          </div>

          <div className="flex flex-wrap gap-3 mb-6 relative z-10">
            <span className={`px-4 py-2 text-sm font-bold rounded-md border-2 ${tez.type === 'PhD' ? 'bg-amber-200 text-amber-950 border-amber-400' : 'bg-stone-200 text-stone-900 border-stone-400'}`}>
              {tez.type === 'PhD' ? 'Doktora Tezi' : 'Yüksek Lisans Tezi'}
            </span>
            <span className="px-4 py-2 text-sm font-bold rounded-md bg-[#faf7f2]/80 text-stone-800 border-2 border-stone-400">
              {tez.year}
            </span>
            <span className="px-4 py-2 text-sm font-bold rounded-md bg-[#faf7f2]/80 text-stone-800 border-2 border-stone-400">
              {tez.language?.language_name}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-950 mb-4 leading-tight relative z-10" style={{ textShadow: '1px 1px 0px #fff4e0' }}>{tez.title}</h1>
          <div className="text-amber-900 font-bold text-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative z-10">
            <span className="border-b-2 border-amber-900/30 pb-1">{tez.institute?.university?.university_name}</span>
            <span className="hidden md:inline text-amber-700">•</span>
            <span className="text-amber-800 text-lg italic">{tez.institute?.institute_name}</span>
          </div>
        </div>

        {/* İçerik Gövdesi */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 bg-[#fdfbf7]">
          
          {/* SOL KOLON: Özet ve Detaylar */}
          <div className="md:col-span-2 space-y-10">
            <div className="prose prose-stone prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-amber-950 mb-4 flex items-center gap-3 border-b-2 border-amber-900/20 pb-2">
                <BookOpen className="w-6 h-6 text-amber-800" />
                Eser Özeti
              </h3>
              {/* Yazı tipi serif ve okunaklı, renk tam siyah değil koyu kahve */}
              <p className="text-stone-800 leading-loose text-justify text-lg font-serif pl-4 border-l-4 border-amber-900/30 italic">
                {tez.abstract}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t-2 border-dashed border-stone-300">
              <div>
                 <h3 className="text-sm font-extrabold text-stone-600 uppercase tracking-widest mb-4">Anahtar Kelimeler</h3>
                 <div className="flex flex-wrap gap-3 pl-2">
                   {tez.thesis_keyword?.map((item, index) => (
                     <span key={index} className="px-4 py-2 bg-[#eaddc5] text-amber-950 rounded-lg text-sm font-bold border-b-2 border-r-2 border-amber-900/20 shadow-sm">
                       {item.keyword?.keyword_text}
                     </span>
                   ))}
                 </div>
              </div>

              <div>
                 <h3 className="text-sm font-extrabold text-stone-600 uppercase tracking-widest mb-4">Konu Alanları</h3>
                 <div className="flex flex-wrap gap-3 pl-2">
                   {tez.thesis_subject_topic?.map((item, index) => (
                     <span key={index} className="px-4 py-2 bg-stone-200 text-stone-900 rounded-lg text-sm font-bold border-b-2 border-r-2 border-stone-400 shadow-sm">
                       {item.subject_topic?.topic_name}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          </div>

          {/* SAĞ KOLON: Künye Kartı - Daha koyu bir kağıt rengi */}
          <div className="bg-[#f0eadd] p-8 rounded-xl h-fit space-y-8 border-2 border-[#d6c7a8] shadow-inner relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-amber-900/10"></div>
            
            <div className="mt-4">
              <span className="block text-xs font-extrabold text-stone-500 uppercase mb-2 tracking-widest">Eser Sahibi (Yazar)</span>
              <div className="text-amber-950 font-extrabold text-2xl bg-[#faf7f2] p-3 rounded border-l-4 border-amber-900">
                {tez.author?.first_name} {tez.author?.last_name}
              </div>
            </div>

            <div>
              <span className="block text-xs font-extrabold text-stone-500 uppercase mb-2 tracking-widest">Tez Danışmanı</span>
              <div className="text-stone-900 font-bold text-xl bg-[#faf7f2] p-3 rounded border-l-4 border-stone-500">
                {tez.supervisor?.first_name} {tez.supervisor?.last_name}
              </div>
            </div>

            {tez.co_supervisor && (
              <div>
                <span className="block text-xs font-extrabold text-stone-500 uppercase mb-2 tracking-widest">Eş Danışman</span>
                <div className="text-stone-800 font-bold text-lg bg-[#faf7f2] p-3 rounded border-l-4 border-stone-400">
                  {tez.co_supervisor.first_name} {tez.co_supervisor.last_name}
                </div>
              </div>
            )}

            <div className="pt-8 border-t-2 border-stone-300 space-y-4 text-stone-700">
              <div className="flex justify-between items-center bg-[#faf7f2] p-2 rounded">
                <span className="text-sm font-bold">Sayfa Sayısı</span>
                <span className="text-stone-900 font-extrabold text-lg">{tez.num_of_pages}</span>
              </div>
              <div className="flex justify-between items-center bg-[#faf7f2] p-2 rounded">
                 <span className="text-sm font-bold">Teslim Tarihi</span>
                 <span className="text-stone-900 font-extrabold text-sm">{tez.submission_date}</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-300">
                 <span className="text-sm font-bold">Katalog No</span>
                 <span className="text-amber-950 font-mono text-base bg-[#eaddc5] px-3 py-1 rounded border border-amber-900/30">#{tez.thesis_no}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}