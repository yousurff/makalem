import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Search() {
  const [theses, setTheses] = useState([])
  const [searchText, setSearchText] = useState('')
  const [languageFilter, setLanguageFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('thesis')
          .select(`*, author:person!author_id(first_name, last_name), language:language(language_name), institute:institute(institute_name, university:university(university_name))`)
          .eq('approval_status', 'published')

        if (error) throw error
        setTheses(data)
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTheses = theses.filter((thesis) => {
    const textMatch = thesis.title.toLowerCase().includes(searchText.toLowerCase()) || thesis.abstract.toLowerCase().includes(searchText.toLowerCase())
    const langMatch = languageFilter === 'All' || thesis.language?.language_name === languageFilter
    const typeMatch = typeFilter === 'All' || thesis.type === typeFilter
    return textMatch && langMatch && typeMatch
  })

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="bg-[#faf7f2] p-6 rounded-xl shadow-md border-2 border-stone-400 sticky top-28">
          <h2 className="text-xl font-bold text-amber-950 mb-6 border-b-2 border-stone-300 pb-2">Collection Filters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Search</label>
              <input
                type="text"
                placeholder="In title or abstract..."
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm focus:ring-amber-900 focus:border-amber-900 p-3 text-stone-900 font-medium placeholder-stone-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Thesis Type</label>
              <select 
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm p-3 text-stone-900 font-medium focus:ring-amber-900 focus:border-amber-900"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Master">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-stone-800 mb-2">Language</label>
              <select 
                className="w-full bg-stone-100 border-2 border-stone-300 rounded-md shadow-sm p-3 text-stone-900 font-medium focus:ring-amber-900 focus:border-amber-900"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="All">All Languages</option>
                <option value="Türkçe">Turkish</option>
                <option value="English">English</option>
                <option value="Deutsch">German</option>
                <option value="Français">French</option>
              </select>
            </div>
            
            <div className="text-sm font-semibold text-stone-600 pt-6 border-t-2 border-stone-300">
              Found <strong>{filteredTheses.length}</strong> works on this shelf.
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <h1 className="text-3xl font-bold text-amber-950 mb-8 border-b-2 border-stone-300 pb-4">Library Archive</h1>

        {loading ? (
          <div className="text-center py-20 text-amber-900 font-bold text-xl">Scanning shelves...</div>
        ) : filteredTheses.length === 0 ? (
          <div className="bg-[#faf7f2] p-12 rounded-xl shadow-sm text-center text-stone-600 border-2 border-dashed border-stone-400 font-medium text-lg">
            No works found matching your criteria on this shelf.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTheses.map((thesis) => (
              <Link 
                to={`/thesis/${thesis.thesis_no}`} 
                key={thesis.thesis_no} 
                className="block bg-[#faf7f2] p-8 rounded-xl shadow-sm border-2 border-stone-300 hover:border-amber-800 hover:shadow-xl transition-all duration-300 group relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-900/20 rounded-l-xl group-hover:bg-amber-900/40 transition-colors"></div>
                
                <div className="pl-4 flex justify-between items-start">
                  <div className="flex-1">
                     <div className="flex gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${thesis.type === 'PhD' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-200 text-stone-800 border-stone-400'}`}>
                          {thesis.type}
                        </span>
                        <span className="text-stone-600 font-semibold bg-stone-200 px-2 py-1 rounded text-sm border border-stone-300">{thesis.year}</span>
                     </div>
                    <h3 className="text-2xl font-bold text-amber-950 group-hover:text-amber-800 transition-colors leading-snug">
                      {thesis.title}
                    </h3>
                  </div>
                </div>

                <div className="pl-4 mt-4 text-base text-stone-700 font-medium">
                  <span className="text-stone-900 font-bold">{thesis.author?.first_name} {thesis.author?.last_name}</span> 
                  <span className="mx-3 text-amber-800/50 font-bold">•</span>
                  <span className="italic">{thesis.institute?.university?.university_name}</span>
                </div>

                <p className="pl-4 mt-4 text-stone-700 text-base line-clamp-2 italic leading-relaxed">
                  {thesis.abstract}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}