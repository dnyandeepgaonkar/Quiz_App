import { useState, useEffect, useCallback } from 'react'
import Button from '../../Button'
import QuestionCard from './QuestionCard'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiConnector, getErrorMessage } from '../../../services/apiConnector'
import { quizEndpoints } from "../../../services/APIs"
import { setUser } from "../../../slices/AuthSlice"
import toast from 'react-hot-toast'
import { TbClock } from 'react-icons/tb'

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false)
    const [remainingTime, setRemainingTime] = useState(null)
    const [userAnswers, setUserAnswers] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const { token, user } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitQuiz = useCallback(async () => {
        if (submitting) return
        setSubmitting(true)
        const toastId = toast.loading("Submitting quiz...")
        try {
            const response = await apiConnector(
                'POST',
                `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
                {
                    quizId: quizDetails._id,
                    answers: userAnswers,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            )
            dispatch(setUser({ ...user, attemptedQuizzes: [...(user.attemptedQuizzes || []), quizDetails._id] }))
            toast.success("Quiz submitted successfully!")
            navigate('/quiz-results', { state: { score: response.data.score, total: quizQuestions?.length, passed: (response.data.score / quizQuestions?.length) >= 0.4 } })
        } catch (error) {
            console.error('Error submitting quiz:', error)
            toast.error(getErrorMessage(error, "Failed to submit quiz"))
        } finally {
            toast.dismiss(toastId)
            setSubmitting(false)
        }
    }, [dispatch, navigate, quizDetails, quizQuestions?.length, submitting, token, user, userAnswers])

    useEffect(() => {
        if (quizDetails?.timer) {
            setRemainingTime(quizDetails.timer * 60)
        }
    }, [quizDetails])

    useEffect(() => {
        let timer
        if (quizStarted && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1)
            }, 1000)
        } else if (quizStarted && remainingTime === 0) {
            clearInterval(timer)
            toast.error('Time is up! Auto-submitting quiz.')
            submitQuiz()
        }
        return () => clearInterval(timer)
    }, [quizStarted, remainingTime, submitQuiz])

    const handleAnswerChange = useCallback((questionId, selectedOption) => {
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(
                (answer) => answer.questionId === questionId
            )
            if (existingAnswerIndex >= 0) {
                prevAnswers[existingAnswerIndex].selectedOption = selectedOption
            } else {
                prevAnswers.push({ questionId, selectedOption })
            }
            return [...prevAnswers]
        })
    }, [])

    const startQuiz = () => {
        setQuizStarted(true)
        toast.success("Quiz started! Good luck.")
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    const isTimeLow = remainingTime < 60; // Less than 1 min
    const answeredCount = userAnswers.length
    const totalQuestions = quizQuestions?.length || 0
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

    return (
        <div className='w-full'>
            {!quizStarted ? (
                <div className='surface-card mx-auto mt-10 flex max-w-xl flex-col items-center gap-5 p-8 text-center'>
                    <h2 className="section-title">Ready when you are</h2>
                    <p className="muted-text">Your timer starts after you press start. Make sure you have a stable connection before submitting.</p>
                    <Button className='max-w-xs' active={true} onClick={startQuiz}>Start Quiz Now</Button>
                </div>
            ) : (
                <div className='w-full flex flex-col relative'>
                    <div className="sticky top-[5rem] z-20 mb-6 surface-card p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</p>
                                <p className="muted-text text-sm">{answeredCount} of {totalQuestions} answered</p>
                            </div>
                            <div className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-300 ${isTimeLow ? 'border-red-500/50 bg-red-500/10 text-red-500 animate-pulse' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200'}`}>
                                <TbClock size={20} />
                                <span className='font-mono text-lg font-bold'>{formatTime(remainingTime)}</span>
                            </div>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-6 mb-8'>
                        {quizQuestions && quizQuestions.map((ques, index) => (
                            <QuestionCard
                                key={ques._id}
                                question={ques}
                                index={index + 1}
                                selectedAnswer={userAnswers.find(answer => answer.questionId === ques._id)?.selectedOption}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>

                    <div className='flex justify-end'>
                        <Button disabled={submitting || totalQuestions === 0} className='w-full md:w-auto md:min-w-[200px]' active={true} onClick={submitQuiz}>
                            {submitting ? "Submitting..." : "Submit Quiz"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default QuizQuestions
