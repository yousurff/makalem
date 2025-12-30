import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManageLanguage() {
  const [languages, setLanguages] = useState([])
  const [newLangName, setNewLangName] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('language')
        .select('*')
        .order('language_id', { ascending: true })
      
      if (error) throw error
      setLanguages(data)
    } catch (error) {
      alert('Data error: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

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
      fetchLanguages() 
    } catch (error) {
      alert('Add error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this language? (Cannot be deleted if used in theses)')) return

    try {
      const { error } = await supabase
        .from('language')
        .delete()
        .eq('language_id', id)

      if (error) throw error
      fetchLanguages()
    } catch (error) {
      alert('Deletion error: ' + error.message)
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
          <Languages className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Language Management</h1>
            <p className="text-amber-200 text-sm">Manage valid thesis writing languages in the system.</p>
          </div>
        </div>

        <div className="p-8">
          
          <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <input
              type="text"
              placeholder="New Language Name (e.g. Italian)..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors"
              disabled={!newLangName.trim()}
            >
              <Plus size={20} /> Add
            </button>
          </form>

          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Registered Languages</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Loading...</div>
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