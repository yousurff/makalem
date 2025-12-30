import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Home() {
  const [tezler, setTezler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function tezleriGetir() {
      try {
        const { data, error } = await supabase
          .from('thesis') 
          .select(`*, author:person!author_id(first_name, last_name), language:language(language_name)`)
          .eq('approval_status', 'published')
          .limit(6)

        if (error) throw error
        setTezler(data)
      } catch (err) {
        console.error('Data error:', err)
      } finally {
        setYukleniyor(false)
      }
    }
    tezleriGetir()
  }, [])

  if (yukleniyor) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-900 border-t-transparent"></div></div>

  return (
    <div className="space-y-12 p-4">
      <section className="relative bg-[#faf7f2] overflow-hidden rounded-xl shadow-md border-2 border-stone-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 p-6 sm:p-10">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-amber-950 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Academic Knowledge</span>{' '}
                  <span className="block text-amber-800 xl:inline">Quick Access</span>
                </h1>
                <p className="mt-3 text-lg text-stone-700 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-medium">
                  Access thousands of master's and PhD theses in our library from a single point.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <div className="rounded-md shadow">
                    <Link to="/search" className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-amber-50 bg-amber-900 hover:bg-amber-800 transition-colors">
                      Search Library
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Link to="/submit" className="w-full flex items-center justify-center px-8 py-4 border-2 border-amber-900 text-lg font-bold rounded-md text-amber-900 bg-[#f5efe6] hover:bg-amber-100 transition-colors">
                      Submit Thesis
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-stone-300 pb-4">
          <h2 className="text-3xl font-bold text-amber-950">Recently Added Theses</h2>
          <Link to="/search" className="text-amber-800 hover:text-amber-950 font-semibold text-lg">Full Collection &rarr;</Link>
        </div>
        
        {tezler.length === 0 ? (
           <div className="text-center py-16 bg-[#f5efe6] rounded-xl border-2 border-dashed border-stone-400">
             <p className="text-stone-600 text-xl font-medium">No published theses found yet.</p>
           </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tezler.map((tez) => (
              <div key={tez.thesis_no} className="group bg-[#faf7f2] border-2 border-stone-300 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-amber-700 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-amber-900/10 rotate-45 transform"></div>

                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${tez.type === 'PhD' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-200 text-stone-800 border-stone-400'}`}>
                    {tez.type === 'PhD' ? 'PhD' : "Master's"}
                  </span>
                  <span className="text-lg font-bold text-stone-600 bg-[#eaddc5] px-3 py-1 rounded-md border border-[#d6c7a8]">{tez.year}</span>
                </div>
                
                <h3 className="text-xl font-bold text-amber-950 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors leading-tight">
                  {tez.title}
                </h3>
                
                <p className="text-stone-700 text-base mb-6 line-clamp-3 flex-grow italic leading-relaxed">
                  {tez.abstract}
                </p>
                
                <div className="border-t-2 border-stone-200 pt-4 mt-auto">
                  <div className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-amber-900 flex items-center justify-center text-amber-50 text-sm font-bold shadow-sm border border-amber-950">
                        {tez.author?.first_name ? tez.author.first_name[0] : '?'}
                      </div>
                      <span className="font-bold text-stone-800">{tez.author?.first_name} {tez.author?.last_name}</span>
                    </div>
                    <span className="text-stone-600 font-semibold bg-stone-200 px-2 rounded">{tez.language?.language_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}