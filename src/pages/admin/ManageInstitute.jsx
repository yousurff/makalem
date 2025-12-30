import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Landmark } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManageInstitute() {
  const [institutes, setInstitutes] = useState([])
  const [universities, setUniversities] = useState([]) // Dropdown için
  const [form, setForm] = useState({ name: '', uni_id: '' })
  const [yukleniyor, setYukleniyor] = useState(true)

  // Verileri Çek (Hem Enstitüler hem Üniversiteler)
  const fetchData = async () => {
    try {
      // 1. Enstitüleri üniversite adıyla beraber çek
      const { data: instData, error: instError } = await supabase
        .from('institute')
        .select('*, university(university_name)')
        .order('institute_id', { ascending: true })
      
      if (instError) throw instError

      // 2. Üniversite listesini çek (Ekleme kutusu için)
      const { data: uniData, error: uniError } = await supabase
        .from('university')
        .select('*')
        .order('university_name', { ascending: true })

      if (uniError) throw uniError

      setInstitutes(instData)
      setUniversities(uniData)
    } catch (error) {
      alert('Veri hatası: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Ekleme Fonksiyonu
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.uni_id) {
      alert('Lütfen hem enstitü adını hem de üniversiteyi seçin.')
      return
    }

    try {
      const randomId = Math.floor(Math.random() * 10000) + 100

      const { error } = await supabase
        .from('institute')
        .insert([{ 
          institute_id: randomId, 
          institute_name: form.name,
          university_id: parseInt(form.uni_id)
        }])

      if (error) throw error

      setForm({ name: '', uni_id: '' }) // Formu temizle
      fetchData() // Listeyi yenile
    } catch (error) {
      alert('Ekleme hatası: ' + error.message)
    }
  }

  // Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (!window.confirm('Bu enstitüyü silmek istediğinize emin misiniz? (Bağlı tezler varsa silinemez)')) return

    try {
      const { error } = await supabase
        .from('institute')
        .delete()
        .eq('institute_id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      alert('Silme hatası (Muhtemelen bu enstitüye ait tezler var): ' + error.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="flex items-center text-stone-600 hover:text-amber-900 mb-6 font-bold transition-colors w-fit">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Yönetim Paneline Dön
      </Link>

      <div className="bg-[#faf7f2] shadow-xl rounded-xl overflow-hidden border-2 border-stone-300">
        
        {/* Başlık */}
        <div className="bg-amber-900 p-6 text-amber-50 flex items-center gap-3">
          <Landmark className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Enstitü Yönetimi</h1>
            <p className="text-amber-200 text-sm">Üniversitelere bağlı enstitüleri düzenleyin.</p>
          </div>
        </div>

        <div className="p-8">
          
          {/* Ekleme Formu */}
          <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <div className="md:col-span-1">
              <select 
                className="w-full border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900 bg-stone-50"
                value={form.uni_id}
                onChange={(e) => setForm({...form, uni_id: e.target.value})}
              >
                <option value="">Üniversite Seç...</option>
                {universities.map(u => (
                  <option key={u.university_id} value={u.university_id}>{u.university_name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <input
                type="text"
                placeholder="Enstitü Adı (Örn: Fen Bilimleri Enstitüsü)..."
                className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
              <button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Plus size={20} /> Ekle
              </button>
            </div>
          </form>

          {/* Liste */}
          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Kayıtlı Enstitüler</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Yükleniyor...</div>
          ) : (
            <div className="space-y-3">
              {institutes.map((inst) => (
                <div key={inst.institute_id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors shadow-sm group">
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-stone-800">
                      {inst.institute_name}
                    </span>
                    <span className="text-sm text-amber-800 font-bold flex items-center gap-1">
                      <span className="text-stone-400 font-normal">Bağlı Olduğu:</span> 
                      {inst.university?.university_name}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(inst.institute_id)}
                    className="text-stone-400 hover:text-red-600 p-2 rounded transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}