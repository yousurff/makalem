import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManageLanguage() {
  const [languages, setLanguages] = useState([])
  const [newLangName, setNewLangName] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)

  // Verileri Çek
  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('language')
        .select('*')
        .order('language_id', { ascending: true })
      
      if (error) throw error
      setLanguages(data)
    } catch (error) {
      alert('Veri hatası: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  // Ekleme Fonksiyonu
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newLangName.trim()) return

    try {
      const randomId = Math.floor(Math.random() * 1000) + 10

      const { error } = await supabase
        .from('language')
        .insert([{ language_id: randomId, language_name: newLangName }])

      if (error) throw error

      setNewLangName('')
      fetchLanguages() // Listeyi yenile
    } catch (error) {
      alert('Ekleme hatası: ' + error.message)
    }
  }

  // Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (!window.confirm('Bu dili silmek istediğinize emin misiniz? (Kullanıldığı tezler varsa silinemez)')) return

    try {
      const { error } = await supabase
        .from('language')
        .delete()
        .eq('language_id', id)

      if (error) throw error
      fetchLanguages()
    } catch (error) {
      alert('Silme hatası: ' + error.message)
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
          <Languages className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Dil Yönetimi</h1>
            <p className="text-amber-200 text-sm">Sistemde geçerli tez yazım dillerini düzenleyin.</p>
          </div>
        </div>

        <div className="p-8">
          
          {/* Ekleme Formu */}
          <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <input
              type="text"
              placeholder="Yeni Dil Adı (Örn: İtalyanca)..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors"
              disabled={!newLangName.trim()}
            >
              <Plus size={20} /> Ekle
            </button>
          </form>

          {/* Liste */}
          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Kayıtlı Diller</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div key={lang.language_id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors shadow-sm group">
                  <span className="text-lg font-medium text-stone-800">
                    {lang.language_name}
                  </span>
                  <button 
                    onClick={() => handleDelete(lang.language_id)}
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