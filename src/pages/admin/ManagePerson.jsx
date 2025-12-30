import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, ArrowLeft, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManagePerson() {
  const [people, setPeople] = useState([])
  const [form, setForm] = useState({ first_name: '', last_name: '' })
  const [yukleniyor, setYukleniyor] = useState(true)

  const fetchPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('person')
        .select('*')
        .order('person_id', { ascending: false }) 
      
      if (error) throw error
      setPeople(data)
    } catch (error) {
      alert('Data error: ' + error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    fetchPeople()
  }, [])

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

      setForm({ first_name: '', last_name: '' }) 
      fetchPeople() 
    } catch (error) {
      alert('Add error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person? (Cannot be deleted if linked to a thesis)')) return

    try {
      const { error } = await supabase
        .from('person')
        .delete()
        .eq('person_id', id)

      if (error) throw error
      fetchPeople()
    } catch (error) {
      alert('Deletion error (This person might be an author or supervisor of a thesis): ' + error.message)
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
          <Users className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Person Management</h1>
            <p className="text-amber-200 text-sm">Manage Authors and Academic Supervisors.</p>
          </div>
        </div>

        <div className="p-8">
          
          <form onSubmit={handleAdd} className="flex gap-4 mb-10 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <input
              type="text"
              placeholder="First Name..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={form.first_name}
              onChange={(e) => setForm({...form, first_name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Last Name..."
              className="flex-1 border-2 border-stone-300 rounded-md p-3 text-stone-900 focus:ring-amber-900 focus:border-amber-900"
              value={form.last_name}
              onChange={(e) => setForm({...form, last_name: e.target.value})}
            />
            <button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 transition-colors"
              disabled={!form.first_name || !form.last_name}
            >
              <Plus size={20} /> Add
            </button>
          </form>

          <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Registered People</h3>
          
          {yukleniyor ? (
            <div className="text-center p-4">Loading...</div>
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