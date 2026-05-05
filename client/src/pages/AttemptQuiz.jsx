import { useCallback, useEffect, useState } from 'react'
import { apiConnector, getErrorMessage } from "../services/apiConnector"
import { useParams } from 'react-router-dom'
import { questionEndpoints, quizEndpoints } from '../services/APIs'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import QuizQuestions from '../components/core/attemptQuiz/QuizQuestions'
import { TbClockHour4, TbUser, TbCalendar } from 'react-icons/tb'
import toast from 'react-hot-toast'

const AttemptQuiz = () => {
    const [quizDetails, setQuizDetails] = useState(null)
    const [quizQuestions, setQuisQuestions] = useState(null)
    const [detailsLoading, setDetailsLoading] = useState(true)
    const [questionsLoading, setQuestionsLoading] = useState(true)

    const { token } = useSelector(state => state.auth)
    const { id: quizId } = useParams()

    const fetchQuizQuestions = useCallback(async () => {
        setQuestionsLoading(true)
        try {
            const response = await apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${quizId}`, null, {
                Authorization: `Bearer ${token}`
            })
            setQuisQuestions(response?.data?.data)
        } catch (error) {
            console.log('Error fetching quiz details:', error)
            toast.error(getErrorMessage(error, "Failed to fetch quiz questions"))
        } finally {
            setQuestionsLoading(false)
        }
    }, [quizId, token])

    const fetchQuizDetails = useCallback(async () => {
        try {
            setDetailsLoading(true)
            const response = await apiConnector("GET", `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`, null, {
                Authorization: `Bearer ${token}`
            })
            setQuizDetails(response?.data?.data)
        } catch (error) {
            console.log('Error fetching quiz details:', error)
            toast.error(getErrorMessage(error, "Failed to fetch quiz details"))
        } finally {
            setDetailsLoading(false)
        }
    }, [quizId, token])

    useEffect(() => {
        fetchQuizDetails()
        fetchQuizQuestions()
    }, [fetchQuizDetails, fetchQuizQuestions])

    return (
        <section className='mx-auto min-h-[90vh] max-w-4xl py-8 animate-fade-up'>
            <div className='glass-card relative mb-8 overflow-hidden p-6 md:p-8'>
                {questionsLoading || detailsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className='relative z-10'>
                        <h1 className='page-title mb-4 md:text-4xl'>{quizDetails?.title}</h1>
                        <p className='muted-text mb-6 text-lg leading-relaxed'>{quizDetails?.description}</p>
                        
                        <div className='flex flex-wrap gap-4 text-sm'>
                            <div className='chip text-indigo-700 dark:text-indigo-300'>
                                <TbClockHour4 size={18} />
                                <span>{quizDetails?.timer} Minutes</span>
                            </div>
                            <div className='chip'>
                                <TbUser size={18} />
                                <span>Created by {quizDetails?.createdBy?.username}</span>
                            </div>
                            <div className='chip'>
                                <TbCalendar size={18} />
                                <span>{formatDistanceToNow(new Date(quizDetails.createdAt), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {(!questionsLoading && !detailsLoading) && (
                <QuizQuestions quizDetails={quizDetails} quizQuestions={quizQuestions} />
            )}
        </section>
    )
}
export default AttemptQuiz
