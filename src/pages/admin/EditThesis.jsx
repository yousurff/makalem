import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, ArrowLeft, PenTool } from 'lucide-react'

export default function EditThesis() {
  const { id } = useParams() 
  const navigate = useNavigate()
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const [diller, setDiller] = useState([])
  const [enstituler, setEnstituler] = useState([])
  const [kisiler, setKisiler] = useState([])

  const [formData, setFormData] = useState({
    title: '', abstract: '', year: '', type: '', num_of_pages: '',
    submission_date: '', language_id: '', institute_id: '',
    author_id: '', supervisor_id: '', co_supervisor_id: '',
    approval_status: ''
  })

  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data: dillerData } = await supabase.from('language').select('*')
        const { data: enstitulerData } = await supabase.from('institute').select('*, university(*)')
        const { data: kisilerData } = await supabase.from('person').select('*')

        setDiller(dillerData || [])
        setEnstituler(enstitulerData || [])
        setKisiler(kisilerData || [])

        const { data: tez, error } = await supabase
          .from('thesis')
          .select('*')
          .eq('thesis_no', id)
          .single()

        if (error) throw error

        setFormData({
          title: tez.title,
          abstract: tez.abstract,
          year: tez.year,
          type: tez.type,
          num_of_pages: tez.num_of_pages,
          submission_date: tez.submission_date,
          language_id: tez.language_id,
          institute_id: tez.institute_id,
          author_id: tez.author_id,
          supervisor_id: tez.supervisor_id,
          co_supervisor_id: tez.co_supervisor_id || '',
          approval_status: tez.approval_status
        })
      } catch (err) {
        setHata('Data could not be loaded: ' + err.message)
      } finally {
        setYukleniyor(false)
      }
    }
    verileriGetir()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setYukleniyor(true)
    
    try {
      const { error } = await supabase
        .from('thesis')
        .update({
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
          approval_status: formData.approval_status 
        })
        .eq('thesis_no', id)

      if (error) throw error

      alert('Thesis successfully updated.')
      navigate('/admin/theses') 
    } catch (err) {
      alert('Update error: ' + err.message)
    } finally {
      setYukleniyor(false)
    }
  }

  if (yukleniyor) return <div className="text-center p-20">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/theses" className="flex items-center text-stone-600 hover:text-amber-900 mb-6 font-bold transition-colors w-fit">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Return to Thesis List
      </Link>

      <div className="bg-[#faf7f2] shadow-2xl rounded-xl overflow-hidden border-2 border-stone-300">
        <div className="bg-amber-900 p-6 flex items-center gap-4 text-amber-50">
          <PenTool className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Edit Thesis</h1>
            <p className="text-amber-200 text-sm">You are editing thesis #{id}.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          {hata && <div className="text-red-600 font-bold">{hata}</div>}

          <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <label className="block text-sm font-bold text-amber-900 mb-2">Publication Status</label>
            <select name="approval_status" value={formData.approval_status} onChange={handleChange} className="w-full bg-white border-2 border-amber-300 rounded p-2 text-amber-900 font-bold">
              <option value="pending">Pending Approval</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Abstract</label>
              <textarea required name="abstract" rows="4" value={formData.abstract} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Year</label>
                <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white" />
             </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Pages</label>
                <input required type="number" name="num_of_pages" value={formData.num_of_pages} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white" />
             </div>
             <div className="col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white">
                  <option value="Master">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Institute</label>
                <select required name="institute_id" value={formData.institute_id} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white">
                  {enstituler.map(i => <option key={i.institute_id} value={i.institute_id}>{i.university?.university_name} - {i.institute_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Language</label>
                <select required name="language_id" value={formData.language_id} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white">
                  {diller.map(l => <option key={l.language_id} value={l.language_id}>{l.language_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Author</label>
                <select required name="author_id" value={formData.author_id} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white">
                  {kisiler.map(k => <option key={k.person_id} value={k.person_id}>{k.first_name} {k.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Supervisor</label>
                <select required name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} className="w-full border-2 border-stone-300 rounded p-2 bg-white">
                  {kisiler.map(k => <option key={k.person_id} value={k.person_id}>{k.first_name} {k.last_name}</option>)}
                </select>
              </div>
          </div>

          <button type="submit" className="w-full bg-green-700 text-white font-bold py-3 rounded hover:bg-green-800 transition shadow-md flex justify-center gap-2">
            <Save /> Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}