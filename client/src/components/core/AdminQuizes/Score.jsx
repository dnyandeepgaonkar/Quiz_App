import { useEffect, useState } from 'react'
import { quizEndpoints } from '../../../services/APIs'
import { apiConnector, getErrorMessage } from '../../../services/apiConnector'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const Score = ({ quiz }) => {

    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = useSelector(state => state.auth)

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await apiConnector("GET", `${quizEndpoints.GET_SCORES}/${quiz._id}`, null, {
                    Authorization: `Bearer ${token}`
                })
                // console.log("res : ", response)
                setScores(response?.data?.data)
            } catch (error) {
                console.log("error : ", error)
                toast.error(getErrorMessage(error, "Failed to fetch scores"))
            } finally {
                setLoading(false)
            }
        }

        fetchScores()
    }, [quiz._id, token])

    return (
        <div className='z-[2] mt-5 flex w-full flex-col gap-1 rounded-xl bg-slate-50 py-5 text-xl dark:bg-slate-950/70'>
            {
                loading ? (
                    <div className='muted-text text-center'>Loading results...</div>
                ) : !loading && scores.length > 0 ? (
                    <div className='overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800'>
                        <h3 className='bg-slate-100 px-3 py-3 text-center text-lg font-bold text-slate-950 dark:bg-slate-800 dark:text-white'>Results</h3>
                        <div className='flex justify-between px-5 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400'>
                            <p>Username</p>
                            <p>Score</p>
                        </div>
                        {
                            [...scores].reverse().map((score, index) => (
                                <div className='flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800' key={index}>
                                    <span className='flex flex-col md:flex-row gap-1 items-center'>
                                        <p className='text-sm font-semibold text-slate-800 dark:text-slate-100 md:text-lg'>{score?.userId?.username}</p>
                                        <p className='muted-text text-xs md:text-sm'>
                                            - {formatDistanceToNow(new Date(score.createdAt), { addSuffix: true })}
                                        </p>
                                    </span>
                                    <p>
                                        <span className={`${score?.score / score.answers.length >= 0.4 ? "text-emerald-500" : "text-red-500"}`}>
                                            {score?.score}
                                        </span> / {score.answers.length}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <p className='muted-text text-center'>No scores found</p>
                )
            }
        </div>
    )
}

export default Score
