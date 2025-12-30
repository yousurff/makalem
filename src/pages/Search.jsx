import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, Filter, ArrowRight, BookOpen } from 'lucide-react'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase
        .from('thesis')
        .select(`
          *,
          author:person!author_id(first_name, last_name),
          language:language(language_name),
          institute:institute(institute_name, university(university_name))
        `)
        .eq('approval_status', 'published')

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-[60vh]">
      <div className="bg-[#faf7f2] p-10 rounded-xl shadow-lg border-2 border-stone-300 text-center">
        <h1 className="text-3xl font-bold text-amber-950 font-serif mb-4">Detailed Thesis Search</h1>
        <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
          Search our archive by thesis title, abstract content, or keywords.
        </p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Type keywords (e.g. Artificial Intelligence, History)..." 
              className="w-full pl-12 p-4 rounded-lg border-2 border-stone-300 focus:border-amber-900 focus:ring-amber-900 text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-amber-900 text-amber-50 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-800 transition shadow-md flex items-center gap-2">
            <Filter size={20} /> Search
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
           <div className="text-center py-10">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-900 border-t-transparent"></div>
           </div>
        ) : (
          <>
            {hasSearched && (
              <h2 className="text-2xl font-bold text-stone-800 border-b-2 border-stone-200 pb-2">
                Search Results: {results.length} found
              </h2>
            )}

            {results.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {results.map((thesis) => (
                  <Link to={`/thesis/${thesis.thesis_no}`} key={thesis.thesis_no} className="block bg-white border border-stone-200 rounded-lg p-6 hover:shadow-xl hover:border-amber-400 transition group">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${thesis.type === 'PhD' ? 'bg-purple-100 text-purple-900' : 'bg-green-100 text-green-900'}`}>
                        {thesis.type === 'PhD' ? 'PhD' : "Master's"}
                      </span>
                      <span className="text-stone-500 text-sm font-mono bg-stone-100 px-2 py-1 rounded">
                        {thesis.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {thesis.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                      {thesis.abstract}
                    </p>
                    <div className="flex items-center justify-between text-sm text-stone-500 border-t border-stone-100 pt-3">
                      <span className="font-bold text-stone-700 flex items-center gap-2">
                        <BookOpen size={16}/> {thesis.author?.first_name} {thesis.author?.last_name}
                      </span>
                      <span className="flex items-center gap-1 text-amber-800 font-bold group-hover:translate-x-1 transition-transform">
                        Details <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : hasSearched && (
              <div className="text-center py-12 bg-stone-100 rounded-lg border-2 border-dashed border-stone-300">
                <p className="text-stone-500 font-bold text-lg">No results found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}