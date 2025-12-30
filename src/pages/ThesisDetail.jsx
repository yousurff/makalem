import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, BookOpen, Calendar, FileText, User, Building2, Languages, Hash, Tag } from 'lucide-react'

export default function ThesisDetail() {
  const { id } = useParams()
  const [thesis, setThesis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchThesisDetail() {
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
          .eq('thesis_no', id)
          .single()

        if (error) throw error
        setThesis(data)
      } catch (err) {
        setError('Thesis not found or an error occurred.')
      } finally {
        setLoading(false)
      }
    }
    fetchThesisDetail()
  }, [id])

  if (loading) return <div className="text-center p-20 text-amber-900 font-bold">Loading thesis details...</div>
  if (error || !thesis) return <div className="text-center p-20 text-red-600 font-bold">{error || 'Thesis not found.'}</div>

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center text-stone-600 hover:text-amber-900 mb-6 font-bold transition-colors">
        <ArrowLeft className="mr-2" size={20} /> Back to Library
      </Link>

      <div className="bg-[#faf7f2] shadow-2xl rounded-xl overflow-hidden border-2 border-stone-300">
        <div className="bg-stone-100 border-b border-stone-200 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-900"></div>
          
          <span className={`inline-block px-4 py-1 mb-4 rounded-full text-sm font-bold tracking-wider shadow-sm border ${thesis.type === 'PhD' ? 'bg-purple-100 text-purple-900 border-purple-200' : 'bg-green-100 text-green-900 border-green-200'}`}>
            {thesis.type === 'PhD' ? 'PHD DISSERTATION' : "MASTER'S THESIS"}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-950 mb-4 leading-tight font-serif">
            {thesis.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 text-stone-600 font-medium">
            <span className="flex items-center gap-1 bg-white px-3 py-1 rounded border border-stone-200">
              <Calendar size={16} className="text-amber-800"/> {thesis.year}
            </span>
            <span className="flex items-center gap-1 bg-white px-3 py-1 rounded border border-stone-200">
              <Languages size={16} className="text-amber-800"/> {thesis.language?.language_name}
            </span>
            <span className="flex items-center gap-1 bg-white px-3 py-1 rounded border border-stone-200">
              <FileText size={16} className="text-amber-800"/> {thesis.num_of_pages} Pages
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm text-center">
              <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-900 mb-3">
                <User size={24} />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Author</p>
              <p className="font-bold text-stone-900 text-lg">{thesis.author?.first_name} {thesis.author?.last_name}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm text-center">
              <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-900 mb-3">
                <BookOpen size={24} />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Supervisor</p>
              <p className="font-bold text-stone-900 text-lg">{thesis.supervisor?.first_name} {thesis.supervisor?.last_name}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm text-center">
              <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-900 mb-3">
                <Building2 size={24} />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Institution</p>
              <p className="font-bold text-stone-900 text-sm">{thesis.institute?.university?.university_name}</p>
              <p className="text-stone-600 text-xs mt-1">{thesis.institute?.institute_name}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-amber-950 mb-3 flex items-center gap-2 border-b-2 border-stone-200 pb-2">
              <FileText className="text-amber-700"/> Abstract
            </h3>
            <div className="bg-white p-6 rounded-xl border border-stone-200 text-stone-700 leading-relaxed text-justify shadow-inner">
              {thesis.abstract}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Tag size={18} className="text-stone-400"/> Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {thesis.thesis_keyword?.map((k, i) => (
                  <span key={i} className="px-3 py-1 bg-stone-200 text-stone-800 rounded-lg text-sm font-semibold border border-stone-300">
                    {k.keyword?.keyword_text}
                  </span>
                ))}
                {(!thesis.thesis_keyword || thesis.thesis_keyword.length === 0) && <span className="text-stone-400 italic">No keywords.</span>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Hash size={18} className="text-stone-400"/> Subject Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {thesis.thesis_subject_topic?.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-sm font-semibold border border-amber-200">
                    {t.subject_topic?.topic_name}
                  </span>
                ))}
                {(!thesis.thesis_subject_topic || thesis.thesis_subject_topic.length === 0) && <span className="text-stone-400 italic">No topics.</span>}
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-stone-200">
             <p className="text-stone-400 text-sm font-mono">Thesis Reference No: #{thesis.thesis_no}</p>
          </div>
        </div>
      </div>
    </div>
  )
}