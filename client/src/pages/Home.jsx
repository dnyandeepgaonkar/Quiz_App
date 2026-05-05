import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { apiConnector, getErrorMessage } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"
import QuizCard from '../components/core/Home/QuizCard'
import { TbSearch, TbClipboardOff } from 'react-icons/tb'
import toast from 'react-hot-toast'

const Home = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const { token } = useSelector(state => state.auth)
  const { user } = useSelector(state => state.auth)

  const fetchQuizzes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", quizEndpoints.GET_ALL_QUIZES, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      setQuizzes(response.data.data)
    } catch (e) {
      console.log("COULDN'T GET QUIZZES", e)
      toast.error(getErrorMessage(e, "Couldn't get quizzes"))
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  const getDifficulty = (timer) => {
    if (timer <= 10) return "quick"
    if (timer <= 30) return "standard"
    return "deep"
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = `${quiz.title} ${quiz.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty === "all" || getDifficulty(Number(quiz.timer || 0)) === difficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <section className='min-h-[90vh] py-8 animate-fade-up'>
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Quiz Library</p>
          <h1 className='page-title mt-2'>Welcome back, {user?.username || "learner"}</h1>
          <p className="muted-text mt-2 max-w-2xl">Choose a quiz, keep your streak moving, and track progress from your dashboard.</p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-[1fr_160px] md:max-w-xl">
          <div className="relative">
            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-field pl-10"
              placeholder="Search quizzes"
              type="search"
            />
          </div>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="input-field">
            <option value="all">All lengths</option>
            <option value="quick">Quick</option>
            <option value="standard">Standard</option>
            <option value="deep">Deep focus</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="skeleton-card h-56" />
          ))}
        </div>
      ) : !loading && filteredQuizzes?.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredQuizzes.map((quiz, index) => (
            <QuizCard key={quiz._id} quiz={quiz} index={index} />
          ))}
        </div>
      ) : (
        <div className='glass-card flex min-h-[50vh] flex-col items-center justify-center p-10 text-center'>
          <TbClipboardOff size={64} className="mb-4 text-slate-400" />
          <h2 className='section-title mb-2'>No Quizzes Found</h2>
          <p className='muted-text'>Try a different search or filter when more quizzes are available.</p>
        </div>
      )}
    </section>
  )
}

export default Home
