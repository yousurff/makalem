import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManageUniversity() {
  const [universities, setUniversities] = useState([])
  const [newUniName, setNewUniName] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('university')
        .select('*')
        .order('university_id', { ascending: true })
      
      if (error) throw error
      setUniversities(data)
    } catch (error) {
      alert('Error fetching data: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchUniversities()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newUniName.trim()) return

    try {
      const randomId = Math.floor(Math.random() * 10000) + 100

      const { error } = await supabase
        .from('university')
        .insert([{ university_id: randomId, university_name: newUniName }])

      if (error) throw error

      setNewUniName('')
      fetchUniversities() 
    } catch (error) {
      alert('Add error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university? (You may get an error if there are associated institutes)')) return

    try {
      const { error } = await supabase
        .from('university')
        .delete()
        .eq('university_id', id)

      if (error) throw error
      fetchUniversities()
    } catch (error) {
      alert('Deletion error (There are likely institutes linked to this university): ' + error.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="flex items-center text-stone-600 hover:text-amber-900 mb-6 font-bold transition-colors w-fit">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Return to Dashboard
      </Link>

      <div className="bg-[#faf7f2] shadow-xl rounded-xl overflow-hidden border-2 border-stone-300">
        
        <div className="bg-amber-900 p-6 text-amber-50 flex items-center gap-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">University Management</h1>
            <p className="text-amber-200 text-sm">Manage registered universities.</p>
          </div>
        </div>

        <div className="p-8">
          
          <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <input
              type="text"
              placeholder="New University Name..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={newUniName}
              onChange={(e) => setNewUniName(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={!newUniName.trim()}
            >
              <Plus size={20} /> Add
            </button>
          </form>

          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Registered Universities</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Loading...</div>
          ) : (
            <div className="space-y-3">
              {universities.map((uni) => (
                <div key={uni.university_id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors shadow-sm group">
                  <span className="text-lg font-medium text-stone-800">
                    <span className="text-stone-400 text-sm mr-3 font-mono">#{uni.university_id}</span>
                    {uni.university_name}
                  </span>
                  <button 
                    onClick={() => handleDelete(uni.university_id)}
                    className="text-stone-400 hover:text-red-600 p-2 rounded transition-colors"
                    title="Delete"
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