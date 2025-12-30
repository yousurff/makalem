import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManagePerson() {
  const [people, setPeople] = useState([])
  const [form, setForm] = useState({ first_name: '', last_name: '' })
  const [yukleniyor, setYukleniyor] = useState(true)

  // Verileri Çek
  const fetchPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('person')
        .select('*')
        .order('person_id', { ascending: false }) // En son eklenen en üstte olsun
      
      if (error) throw error
      setPeople(data)
    } catch (error) {
      alert('Veri hatası: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchPeople()
  }, [])

  // Ekleme Fonksiyonu
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) return

    try {
      const randomId = Math.floor(Math.random() * 10000) + 100

      const { error } = await supabase
        .from('person')
        .insert([{ 
          person_id: randomId, 
          first_name: form.first_name,
          last_name: form.last_name
        }])

      if (error) throw error

      setForm({ first_name: '', last_name: '' }) // Formu temizle
      fetchPeople() // Listeyi yenile
    } catch (error) {
      alert('Ekleme hatası: ' + error.message)
    }
  }

  // Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (!window.confirm('Bu kişiyi silmek istediğinize emin misiniz? (Bir teze bağlıysa silinemez)')) return

    try {
      const { error } = await supabase
        .from('person')
        .delete()
        .eq('person_id', id)

      if (error) throw error
      fetchPeople()
    } catch (error) {
      alert('Silme hatası (Bu kişi bir tezin yazarı veya danışmanı olabilir): ' + error.message)
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
          <Users className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Kişi Yönetimi</h1>
            <p className="text-amber-200 text-sm">Yazar ve Akademik Danışmanları düzenleyin.</p>
          </div>
        </div>

        <div className="p-8">
          
          {/* Ekleme Formu */}
          <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <input
              type="text"
              placeholder="Adı..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={form.first_name}
              onChange={(e) => setForm({...form, first_name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Soyadı..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={form.last_name}
              onChange={(e) => setForm({...form, last_name: e.target.value})}
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors"
              disabled={!form.first_name || !form.last_name}
            >
              <Plus size={20} /> Ekle
            </button>
          </form>

          {/* Liste */}
          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Kayıtlı Kişiler</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Yükleniyor...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {people.map((person) => (
                <div key={person.person_id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors shadow-sm group">
                  <span className="text-lg font-medium text-stone-800">
                    <span className="text-amber-900/50 text-sm mr-2 font-bold">#{person.person_id}</span>
                    {person.first_name} <span className="font-bold">{person.last_name}</span>
                  </span>
                  <button 
                    onClick={() => handleDelete(person.person_id)}
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