import { useSelector } from 'react-redux'
import { useCallback, useState, useEffect } from 'react'
import { apiConnector, getErrorMessage } from "../services/apiConnector"
import { quizEndpoints } from '../services/APIs'
import toast from 'react-hot-toast'
import AttemptCard from '../components/core/History/AttemptCard'
import { TbClipboardX } from 'react-icons/tb'

const History = () => {
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempts] = useState([])
  const { token } = useSelector(state => state.auth)

  const fetchUserAttempts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", quizEndpoints.GET_USER_ATTEMPS, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.error || response.data.message)
      }

      setAttempts(response?.data?.data)

    } catch (e) {
      console.log("Failed to get User Attempts", e)
      toast.error(getErrorMessage(e, "Failed to get user attempts"))
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchUserAttempts();
  }, [fetchUserAttempts])

  return (
    <section className='py-8 animate-fade-up'>
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Performance</p>
          <h1 className='page-title mt-2'>Your Quiz History</h1>
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((item) => <div key={item} className="skeleton-card h-52" />)}
        </div>
      ) : attempt.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {attempt.map((item, index) => (
            <AttemptCard key={item._id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className='glass-card flex min-h-[50vh] flex-col items-center justify-center p-10 text-center'>
          <TbClipboardX size={64} className="mb-4 text-slate-400" />
          <h2 className='section-title mb-2'>No History Found</h2>
          <p className='muted-text'>You haven&apos;t attempted any quizzes yet. Go to the Home page to find quizzes to play.</p>
        </div>
      )}
    </section>
  )
}

export default History
