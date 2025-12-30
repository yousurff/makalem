import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, LogOut, ShieldAlert, Building2, Landmark, Users, Languages, BookOpen, Eye, X, Calendar, FileText } from 'lucide-react'

export default function Dashboard() {
  const [bekleyenTezler, setBekleyenTezler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [inceleTez, setInceleTez] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function verileriGetir() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      try {
        const { data, error } = await supabase
          .from('thesis')
          .select(`
            *,
            author:person!author_id(first_name, last_name),
            supervisor:person!supervisor_id(first_name, last_name),
            co_supervisor:person!co_supervisor_id(first_name, last_name),
            institute:institute(institute_name, university(university_name)),
            language:language(language_name),
            thesis_keyword(keyword(keyword_text)),
            thesis_subject_topic(subject_topic(topic_name))
          `)
          .eq('approval_status', 'pending')

        if (error) throw error
        setBekleyenTezler(data)
      } catch (error) {
        console.error('Data error:', error)
      } finally {
        setYukleniyor(false)
      }
    }
    verileriGetir()
  }, [navigate])

  const tezOnayla = async (thesis_no) => {
    if (!window.confirm('Are you sure you want to publish this thesis?')) return
    try {
      const { error } = await supabase.from('thesis').update({ approval_status: 'published' }).eq('thesis_no', thesis_no)
      if (error) throw error
      setBekleyenTezler(bekleyenTezler.filter(t => t.thesis_no !== thesis_no))
      setInceleTez(null)
      alert('Thesis published successfully!')
    } catch (err) { alert('Error: ' + err.message) }
  }

  const tezReddet = async (thesis_no) => {
    if (!window.confirm('Are you sure you want to delete this thesis permanently?')) return

    try {
      const { error: kError } = await supabase.from('thesis_keyword').delete().eq('thesis_no', thesis_no)
      if (kError) console.log('Keyword deletion warning:', kError)

      const { error: tError } = await supabase.from('thesis_subject_topic').delete().eq('thesis_no', thesis_no)
      if (tError) console.log('Topic deletion warning:', tError)

      const { error } = await supabase.from('thesis').delete().eq('thesis_no', thesis_no)

      if (error) throw error

      setBekleyenTezler(bekleyenTezler.filter(t => t.thesis_no !== thesis_no))
      setInceleTez(null)
      alert('Thesis rejected and deleted.')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const cikisYap = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (yukleniyor) return <div className="text-center p-20 text-amber-900">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-8 border-b-2 border-stone-300 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-950 font-serif">Dashboard</h1>
          <p className="text-stone-600">System management and pending works</p>
        </div>
        <button onClick={cikisYap} className="flex items-center gap-2 px-4 py-2 text-stone-700 bg-stone-200 hover:bg-stone-300 rounded-md font-bold transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button onClick={() => navigate('/admin/theses')} className="col-span-2 md:col-span-4 bg-amber-800 text-white p-6 rounded-lg border-2 border-amber-900 hover:bg-amber-900 transition font-bold shadow-md flex flex-col items-center gap-2 group">
            <BookOpen size={32} className="group-hover:scale-110 transition-transform"/>
            MANAGE ALL THESES (EDIT / DELETE)
        </button>
        <button onClick={() => navigate('/admin/universities')} className="bg-white p-4 rounded-lg border-2 border-stone-300 hover:border-amber-600 hover:text-amber-900 transition font-bold text-stone-600 shadow-sm flex flex-col items-center gap-2 group">
            <Building2 size={28} className="text-amber-800 group-hover:scale-110 transition-transform"/> Universities
        </button>
        <button onClick={() => navigate('/admin/institutes')} className="bg-white p-4 rounded-lg border-2 border-stone-300 hover:border-amber-600 hover:text-amber-900 transition font-bold text-stone-600 shadow-sm flex flex-col items-center gap-2 group">
            <Landmark size={28} className="text-amber-800 group-hover:scale-110 transition-transform"/> Institutes
        </button>
        <button onClick={() => navigate('/admin/people')} className="bg-white p-4 rounded-lg border-2 border-stone-300 hover:border-amber-600 hover:text-amber-900 transition font-bold text-stone-600 shadow-sm flex flex-col items-center gap-2 group">
            <Users size={28} className="text-amber-800 group-hover:scale-110 transition-transform"/> People
        </button>
        <button onClick={() => navigate('/admin/languages')} className="bg-white p-4 rounded-lg border-2 border-stone-300 hover:border-amber-600 hover:text-amber-900 transition font-bold text-stone-600 shadow-sm flex flex-col items-center gap-2 group">
            <Languages size={28} className="text-amber-800 group-hover:scale-110 transition-transform"/> Languages
        </button>
      </div>

      <h3 className="text-xl font-bold text-amber-950 mb-4 border-b-2 border-stone-300 pb-2">Pending Works</h3>

      {bekleyenTezler.length === 0 ? (
        <div className="bg-[#faf7f2] p-12 text-center rounded-xl border-2 border-dashed border-stone-300">
          <ShieldAlert className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-stone-600">No new theses to review.</h3>
          <p className="text-stone-500">All submissions have been evaluated.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bekleyenTezler.map((tez) => (
            <div key={tez.thesis_no} className="bg-[#faf7f2] p-6 rounded-xl border border-stone-300 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded text-xs font-bold border border-amber-200">#{tez.thesis_no}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${tez.type === 'PhD' ? 'bg-purple-100 text-purple-900' : 'bg-green-100 text-green-900'}`}>{tez.type}</span>
                  <span className="text-stone-500 text-sm flex items-center gap-1"><Calendar size={12}/> {tez.submission_date}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-1">{tez.title}</h3>
                <p className="text-stone-600 text-sm mb-2">
                  <span className="font-bold">{tez.author?.first_name} {tez.author?.last_name}</span> 
                  <span className="mx-2">•</span> 
                  {tez.institute?.institute_name}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setInceleTez(tez)} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow hover:bg-blue-200 transition font-bold text-sm border border-blue-200"><Eye size={16} /> Review</button>
                <button onClick={() => tezOnayla(tez.thesis_no)} className="flex items-center gap-1 bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800 transition font-bold text-sm"><CheckCircle size={16} /> Publish</button>
                <button onClick={() => tezReddet(tez.thesis_no)} className="flex items-center gap-1 bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition font-bold text-sm"><XCircle size={16} /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {inceleTez && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#faf7f2] w-full max-w-4xl rounded-xl shadow-2xl border-4 border-stone-400 flex flex-col max-h-[90vh]">
            
            <div className="bg-stone-200 p-5 border-b border-stone-300 flex justify-between items-center sticky top-0 z-10">
              <div>
                 <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                   <BookOpen size={24} className="text-amber-900"/> Thesis Review File
                 </h3>
                 <span className="text-xs font-mono text-stone-500">REF NO: #{inceleTez.thesis_no}</span>
              </div>
              <button onClick={() => setInceleTez(null)} className="bg-stone-300 p-2 rounded-full hover:bg-red-600 hover:text-white transition"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="text-center border-b-2 border-stone-300 pb-6">
                <span className={`inline-block px-4 py-1 mb-3 rounded-full text-sm font-bold tracking-wider ${inceleTez.type === 'PhD' ? 'bg-purple-100 text-purple-900' : 'bg-green-100 text-green-900'}`}>
                    {inceleTez.type === 'PhD' ? 'PHD THESIS' : "MASTER'S THESIS"}
                </span>
                <h2 className="text-3xl font-extrabold text-amber-950 leading-tight">{inceleTez.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                 <div className="text-center p-2 border-r border-stone-100 md:border-stone-200 last:border-0">
                    <span className="block text-xs text-stone-400 font-bold uppercase mb-1">Author</span>
                    <span className="block font-bold text-stone-900 text-lg">{inceleTez.author?.first_name} {inceleTez.author?.last_name}</span>
                 </div>
                 <div className="text-center p-2 border-r border-stone-100 md:border-stone-200 last:border-0">
                    <span className="block text-xs text-stone-400 font-bold uppercase mb-1">Supervisor</span>
                    <span className="block font-bold text-stone-900 text-lg">{inceleTez.supervisor?.first_name} {inceleTez.supervisor?.last_name}</span>
                 </div>
                 <div className="text-center p-2">
                    <span className="block text-xs text-stone-400 font-bold uppercase mb-1">Co-Supervisor</span>
                    <span className={`block font-bold text-lg ${inceleTez.co_supervisor ? 'text-stone-900' : 'text-stone-300 italic'}`}>
                        {inceleTez.co_supervisor ? `${inceleTez.co_supervisor.first_name} ${inceleTez.co_supervisor.last_name}` : 'Not Specified'}
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-stone-100 p-4 rounded border border-stone-200">
                    <span className="block text-xs text-stone-500 font-bold uppercase">University</span>
                    <span className="font-semibold text-stone-900">{inceleTez.institute?.university?.university_name}</span>
                 </div>
                 <div className="bg-stone-100 p-4 rounded border border-stone-200">
                    <span className="block text-xs text-stone-500 font-bold uppercase">Institute</span>
                    <span className="font-semibold text-stone-900">{inceleTez.institute?.institute_name}</span>
                 </div>
                 <div className="bg-stone-100 p-4 rounded border border-stone-200">
                    <span className="block text-xs text-stone-500 font-bold uppercase">Language / Pages</span>
                    <span className="font-semibold text-stone-900">{inceleTez.language?.language_name} / {inceleTez.num_of_pages} pg.</span>
                 </div>
                 <div className="bg-stone-100 p-4 rounded border border-stone-200">
                    <span className="block text-xs text-stone-500 font-bold uppercase">Submission Date</span>
                    <span className="font-semibold text-stone-900">{inceleTez.submission_date}</span>
                 </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-800 border-b border-stone-300 mb-3 flex items-center gap-2"><FileText size={18}/> Abstract</h4>
                <div className="bg-white p-4 rounded border border-stone-200 text-stone-700 text-justify leading-relaxed text-sm">
                    {inceleTez.abstract}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-stone-800 text-xs uppercase mb-3 border-b border-stone-200 pb-1">Keywords</h4>
                    {inceleTez.thesis_keyword && inceleTez.thesis_keyword.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                        {inceleTez.thesis_keyword.map((k, i) => (
                            <span key={i} className="bg-stone-200 px-3 py-1 rounded text-sm font-semibold text-stone-800 border border-stone-300 shadow-sm">{k.keyword?.keyword_text}</span>
                        ))}
                        </div>
                    ) : (
                        <span className="text-stone-400 italic text-sm">No keywords entered.</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xs uppercase mb-3 border-b border-stone-200 pb-1">Subject Topics</h4>
                    {inceleTez.thesis_subject_topic && inceleTez.thesis_subject_topic.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                        {inceleTez.thesis_subject_topic.map((t, i) => (
                            <span key={i} className="bg-amber-100 px-3 py-1 rounded text-sm font-semibold text-amber-900 border border-amber-200 shadow-sm">{t.subject_topic?.topic_name}</span>
                        ))}
                        </div>
                    ) : (
                         <span className="text-stone-400 italic text-sm">No subject topics selected.</span>
                    )}
                  </div>
              </div>

            </div>

            <div className="bg-stone-100 p-5 border-t border-stone-300 flex justify-end gap-4 sticky bottom-0">
               <button onClick={() => tezReddet(inceleTez.thesis_no)} className="bg-white text-red-700 px-6 py-3 rounded font-bold hover:bg-red-50 border-2 border-red-200 transition shadow-sm flex items-center gap-2">
                 <XCircle/> Reject and Delete
               </button>
               <button onClick={() => tezOnayla(inceleTez.thesis_no)} className="bg-green-700 text-white px-8 py-3 rounded font-bold hover:bg-green-800 transition shadow-md flex items-center gap-2">
                 <CheckCircle/> Approve and Publish
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}