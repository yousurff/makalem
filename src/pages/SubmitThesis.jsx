import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { BookPlus, Save, AlertCircle, X, Tag, Hash, Plus } from 'lucide-react'

export default function SubmitThesis() {
  const navigate = useNavigate()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState(null)
  
  // Referans Veriler
  const [diller, setDiller] = useState([])
  const [enstituler, setEnstituler] = useState([])
  const [kisiler, setKisiler] = useState([]) 
  const [tumAnahtarKel, setTumAnahtarKel] = useState([]) 
  const [tumKonular, setTumKonular] = useState([])     

  // Seçilen Etiketler (Çoklu seçim için)
  const [secilenAnahtarKelimeler, setSecilenAnahtarKelimeler] = useState([])
  const [secilenKonular, setSecilenKonular] = useState([])

  // Manuel giriş state'leri
  const [yeniAnahtarKelime, setYeniAnahtarKelime] = useState('')
  const [yeniKonu, setYeniKonu] = useState('')

  // Form verileri
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    year: new Date().getFullYear(),
    type: 'Master',
    num_of_pages: '',
    submission_date: new Date().toISOString().split('T')[0],
    language_id: '',
    institute_id: '',
    author_id: '',
    supervisor_id: '',
    co_supervisor_id: ''
  })

  // Verileri Çek
  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data: dillerData } = await supabase.from('language').select('*')
        const { data: enstitulerData } = await supabase.from('institute').select('*, university(*)')
        const { data: kisilerData } = await supabase.from('person').select('*')
        const { data: keywordData } = await supabase.from('keyword').select('*')
        const { data: topicData } = await supabase.from('subject_topic').select('*')

        setDiller(dillerData || [])
        setEnstituler(enstitulerData || [])
        setKisiler(kisilerData || [])
        setTumAnahtarKel(keywordData || [])
        setTumKonular(topicData || [])

      } catch (error) {
        console.error('Veri çekme hatası:', error)
      }
    }
    verileriGetir()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // --- ANAHTAR KELİME İŞLEMLERİ ---
  const anahtarKelimeSec = (e) => {
    const secilenId = parseInt(e.target.value)
    if (!secilenId) return
    if (!secilenAnahtarKelimeler.some(k => k.keyword_id === secilenId)) {
      const kelimeObj = tumAnahtarKel.find(k => k.keyword_id === secilenId)
      setSecilenAnahtarKelimeler([...secilenAnahtarKelimeler, kelimeObj])
    }
    e.target.value = ""
  }

  const manuelAnahtarKelimeEkle = async () => {
    if (!yeniAnahtarKelime.trim()) return
    const mevcut = tumAnahtarKel.find(k => k.keyword_text.toLowerCase() === yeniAnahtarKelime.trim().toLowerCase())
    if (mevcut) {
        if (!secilenAnahtarKelimeler.some(k => k.keyword_id === mevcut.keyword_id)) {
            setSecilenAnahtarKelimeler([...secilenAnahtarKelimeler, mevcut])
        }
        setYeniAnahtarKelime('')
        return
    }
    try {
        const randomId = Math.floor(Math.random() * 100000) + 1000
        const { data, error } = await supabase.from('keyword').insert([{
            keyword_id: randomId, keyword_text: yeniAnahtarKelime.trim()
        }]).select().single()
        if (error) throw error
        setTumAnahtarKel([...tumAnahtarKel, data])
        setSecilenAnahtarKelimeler([...secilenAnahtarKelimeler, data])
        setYeniAnahtarKelime('')
    } catch (err) { alert('Hata: ' + err.message) }
  }

  const anahtarKelimeCikar = (id) => {
    setSecilenAnahtarKelimeler(secilenAnahtarKelimeler.filter(k => k.keyword_id !== id))
  }

  // --- KONU ALANI İŞLEMLERİ ---
  const konuSec = (e) => {
    const secilenId = parseInt(e.target.value)
    if (!secilenId) return
    if (!secilenKonular.some(t => t.topic_id === secilenId)) {
      const konuObj = tumKonular.find(t => t.topic_id === secilenId)
      setSecilenKonular([...secilenKonular, konuObj])
    }
    e.target.value = ""
  }

  const manuelKonuEkle = async () => {
    if (!yeniKonu.trim()) return
    const mevcut = tumKonular.find(t => t.topic_name.toLowerCase() === yeniKonu.trim().toLowerCase())
    if (mevcut) {
        if (!secilenKonular.some(t => t.topic_id === mevcut.topic_id)) {
            setSecilenKonular([...secilenKonular, mevcut])
        }
        setYeniKonu('')
        return
    }
    try {
        const randomId = Math.floor(Math.random() * 100000) + 1000
        const { data, error } = await supabase.from('subject_topic').insert([{
            topic_id: randomId, topic_name: yeniKonu.trim()
        }]).select().single()
        if (error) throw error
        setTumKonular([...tumKonular, data])
        setSecilenKonular([...secilenKonular, data])
        setYeniKonu('')
    } catch (err) { alert('Hata: ' + err.message) }
  }

  const konuCikar = (id) => {
    setSecilenKonular(secilenKonular.filter(t => t.topic_id !== id))
  }

  // --- KAYDETME İŞLEMİ ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // GÜVENLİK KONTROLÜ: Kutuda yazılı ama eklenmemiş veri var mı?
    if (yeniAnahtarKelime.trim()) {
        alert("Dikkat: Anahtar kelime kutusunda yazılı metin var ama (+) butonuna basarak eklemediniz. Lütfen ekleyip tekrar deneyin.")
        return
    }
    if (yeniKonu.trim()) {
        alert("Dikkat: Konu alanında yazılı metin var ama (+) butonuna basarak eklemediniz. Lütfen ekleyip tekrar deneyin.")
        return
    }

    setYukleniyor(true)
    setHata(null)

    try {
      const randomThesisNo = Math.floor(1000 + Math.random() * 9000)

      const { error: thesisError } = await supabase.from('thesis').insert([
        {
          thesis_no: randomThesisNo,
          title: formData.title,
          abstract: formData.abstract,
          year: parseInt(formData.year),
          type: formData.type,
          num_of_pages: parseInt(formData.num_of_pages),
          submission_date: formData.submission_date,
          language_id: parseInt(formData.language_id),
          institute_id: parseInt(formData.institute_id),
          author_id: parseInt(formData.author_id),
          supervisor_id: parseInt(formData.supervisor_id),
          co_supervisor_id: formData.co_supervisor_id ? parseInt(formData.co_supervisor_id) : null,
          approval_status: 'pending'
        }
      ])

      if (thesisError) throw thesisError

      // Many-to-Many ilişkileri ekle
      if (secilenAnahtarKelimeler.length > 0) {
        const keywordInserts = secilenAnahtarKelimeler.map(k => ({
          thesis_no: randomThesisNo,
          keyword_id: k.keyword_id
        }))
        await supabase.from('thesis_keyword').insert(keywordInserts)
      }

      if (secilenKonular.length > 0) {
        const topicInserts = secilenKonular.map(t => ({
          thesis_no: randomThesisNo,
          topic_id: t.topic_id
        }))
        await supabase.from('thesis_subject_topic').insert(topicInserts)
      }

      alert('Tez başarıyla gönderildi! Admin onayından sonra yayınlanacaktır.')
      navigate('/') 
    } catch (err) {
      setHata('Kayıt sırasında hata oluştu: ' + err.message)
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      <div className="bg-[#faf7f2] shadow-2xl rounded-xl overflow-hidden border-2 border-stone-300 relative">
        <div className="bg-amber-900 p-6 flex items-center gap-4 text-amber-50">
          <BookPlus className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-wide">Yeni Tez Kaydı</h1>
            <p className="text-amber-200 text-sm">Lütfen tez bilgilerini eksiksiz doldurunuz.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {hata && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-800">
              <AlertCircle /> {hata}
            </div>
          )}

          {/* BÖLÜM 1: Temel Bilgiler */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-950 border-b-2 border-stone-300 pb-2">Eser Bilgileri</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Tez Başlığı</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-white border-2 border-stone-300 rounded p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900" placeholder="Tezin tam başlığını giriniz..." />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Özet (Abstract)</label>
                <textarea required name="abstract" rows="5" value={formData.abstract} onChange={handleChange}
                  className="w-full bg-white border-2 border-stone-300 rounded p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900" placeholder="Tezin kısa özetini buraya yazınız..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Tez Türü</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="Master">Yüksek Lisans</option>
                  <option value="PhD">Doktora</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Yıl</label>
                <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Sayfa Sayısı</label>
                <input required type="number" name="num_of_pages" value={formData.num_of_pages} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3" />
              </div>
            </div>
          </div>

          {/* BÖLÜM 2: Etiketler ve Konular */}
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-amber-950 border-b-2 border-stone-300 pb-2">Konu ve Anahtar Kelimeler</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Anahtar Kelimeler */}
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                   <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                     <Tag size={16} /> Anahtar Kelimeler
                   </label>
                   
                   <select onChange={anahtarKelimeSec} className="w-full bg-white border-2 border-stone-300 rounded p-2 mb-3">
                     <option value="">Listeden Seçiniz...</option>
                     {tumAnahtarKel.map(k => (
                       <option key={k.keyword_id} value={k.keyword_id}>{k.keyword_text}</option>
                     ))}
                   </select>

                   <div className="flex gap-2 mb-4">
                     <input 
                       type="text" 
                       placeholder="veya Yeni Kelime Yaz..." 
                       className="flex-1 border-2 border-stone-300 rounded p-2 text-sm"
                       value={yeniAnahtarKelime}
                       onChange={(e) => setYeniAnahtarKelime(e.target.value)}
                     />
                     <button type="button" onClick={manuelAnahtarKelimeEkle} className="bg-amber-800 text-white p-2 rounded hover:bg-amber-900 transition" title="Ekle">
                       <Plus size={20} />
                     </button>
                   </div>

                   <div className="flex flex-wrap gap-2">
                     {secilenAnahtarKelimeler.map(k => (
                       <span key={k.keyword_id} className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-bold border border-amber-200 flex items-center gap-1 shadow-sm">
                         {k.keyword_text}
                         <button type="button" onClick={() => anahtarKelimeCikar(k.keyword_id)} className="hover:text-red-600 ml-1"><X size={14}/></button>
                       </span>
                     ))}
                   </div>
                </div>

                {/* Konu Alanları */}
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                   <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                     <Hash size={16} /> Konu Alanları
                   </label>
                   
                   <select onChange={konuSec} className="w-full bg-white border-2 border-stone-300 rounded p-2 mb-3">
                     <option value="">Listeden Seçiniz...</option>
                     {tumKonular.map(t => (
                       <option key={t.topic_id} value={t.topic_id}>{t.topic_name}</option>
                     ))}
                   </select>

                    <div className="flex gap-2 mb-4">
                     <input 
                       type="text" 
                       placeholder="veya Yeni Konu Yaz..." 
                       className="flex-1 border-2 border-stone-300 rounded p-2 text-sm"
                       value={yeniKonu}
                       onChange={(e) => setYeniKonu(e.target.value)}
                     />
                     <button type="button" onClick={manuelKonuEkle} className="bg-blue-800 text-white p-2 rounded hover:bg-blue-900 transition" title="Ekle">
                       <Plus size={20} />
                     </button>
                   </div>

                   <div className="flex flex-wrap gap-2">
                     {secilenKonular.map(t => (
                       <span key={t.topic_id} className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-bold border border-blue-200 flex items-center gap-1 shadow-sm">
                         {t.topic_name}
                         <button type="button" onClick={() => konuCikar(t.topic_id)} className="hover:text-red-600 ml-1"><X size={14}/></button>
                       </span>
                     ))}
                   </div>
                </div>

             </div>
          </div>

          {/* BÖLÜM 3: Akademik Künye */}
          <div className="space-y-6 bg-stone-100 p-6 rounded-lg border border-stone-200">
            <h3 className="text-xl font-bold text-amber-950 border-b-2 border-stone-300 pb-2">Akademik Künye</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Enstitü / Üniversite</label>
                <select required name="institute_id" value={formData.institute_id} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="">Seçiniz...</option>
                  {enstituler.map(inst => (
                    <option key={inst.institute_id} value={inst.institute_id}>
                      {inst.university?.university_name} - {inst.institute_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Yazım Dili</label>
                <select required name="language_id" value={formData.language_id} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="">Seçiniz...</option>
                  {diller.map(lang => (
                    <option key={lang.language_id} value={lang.language_id}>{lang.language_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Yazar</label>
                <select required name="author_id" value={formData.author_id} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="">Yazar Seçiniz...</option>
                  {kisiler.map(kisi => (
                    <option key={kisi.person_id} value={kisi.person_id}>{kisi.first_name} {kisi.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Danışman</label>
                <select required name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="">Danışman Seçiniz...</option>
                  {kisiler.map(kisi => (
                    <option key={kisi.person_id} value={kisi.person_id}>{kisi.first_name} {kisi.last_name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Eş Danışman (Opsiyonel)</label>
                <select name="co_supervisor_id" value={formData.co_supervisor_id} onChange={handleChange} className="w-full bg-white border-2 border-stone-300 rounded p-3">
                  <option value="">Yok</option>
                  {kisiler.map(kisi => (
                    <option key={kisi.person_id} value={kisi.person_id}>{kisi.first_name} {kisi.last_name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={yukleniyor}
              className="flex items-center gap-2 bg-amber-900 text-amber-50 px-8 py-4 rounded-lg font-bold hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {yukleniyor ? 'Kaydediliyor...' : (
                <>
                  <Save className="w-5 h-5" />
                  Tezi Kaydet ve Gönder
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}