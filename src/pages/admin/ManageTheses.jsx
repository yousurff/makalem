import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { Trash2, Edit, ArrowLeft, BookOpen, Search } from 'lucide-react'

export default function ManageTheses() {
  const [theses, setTheses] = useState([])
  const [filter, setFilter] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)

  const fetchTheses = async () => {
    try {
      // TÜM TEZLERİ GETİR (Durum fark etmeksizin)
      const { data, error } = await supabase
        .from('thesis')
        .select(`*, author:person!author_id(first_name, last_name)`)
        .order('thesis_no', { ascending: false })

      if (error) throw error
      setTheses(data)
    } catch (error) {
      alert('Hata: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchTheses()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('DİKKAT! Bu tezi kalıcı olarak silmek üzeresiniz. Onaylıyor musunuz?')) return

    try {
      const { error } = await supabase.from('thesis').delete().eq('thesis_no', id)
      if (error) throw error
      fetchTheses() // Listeyi yenile
    } catch (error) {
      alert('Silme hatası: ' + error.message)
    }
  }

  // Basit istemci tarafı arama
  const filteredTheses = theses.filter(t => 
    t.title.toLowerCase().includes(filter.toLowerCase()) || 
    (t.author?.first_name + ' ' + t.author?.last_name).toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/admin" className="flex items-center text-stone-600 hover:text-amber-900 mb-6 font-bold transition-colors w-fit">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Yönetim Paneline Dön
      </Link>

      <div className="bg-[#faf7f2] shadow-xl rounded-xl overflow-hidden border-2 border-stone-300">
        <div className="bg-amber-900 p-6 text-amber-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold font-serif">Tüm Tezlerin Yönetimi</h1>
              <p className="text-amber-200 text-sm">Arşivdeki tüm eserleri düzenleyin veya silin.</p>
            </div>
          </div>
          <div className="text-amber-200 font-bold text-xl">
             Toplam: {filteredTheses.length}
          </div>
        </div>

        <div className="p-6">
          {/* Arama Çubuğu */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Tez başlığı veya yazar ara..." 
              className="w-full pl-10 p-3 border-2 border-stone-300 rounded-lg focus:border-amber-900 focus:ring-amber-900"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {yukleniyor ? <div className="text-center">Yükleniyor...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-200 text-stone-700 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b-2 border-stone-300">No</th>
                    <th className="p-4 border-b-2 border-stone-300">Durum</th>
                    <th className="p-4 border-b-2 border-stone-300">Başlık</th>
                    <th className="p-4 border-b-2 border-stone-300">Yazar</th>
                    <th className="p-4 border-b-2 border-stone-300 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredTheses.map((tez) => (
                    <tr key={tez.thesis_no} className="hover:bg-white transition-colors">
                      <td className="p-4 font-mono text-sm text-stone-500">#{tez.thesis_no}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${tez.approval_status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tez.approval_status === 'published' ? 'Yayında' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-stone-800 max-w-md truncate" title={tez.title}>
                        {tez.title}
                      </td>
                      <td className="p-4 text-stone-600">
                        {tez.author?.first_name} {tez.author?.last_name}
                      </td>
                      <td className="p-4 text-right space-x-2 flex justify-end">
                        <Link 
                          to={`/admin/edit-thesis/${tez.thesis_no}`}
                          className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                          title="Düzenle"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(tez.thesis_no)}
                          className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}