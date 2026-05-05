import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux';
import { TbArrowRight, TbClock, TbUser } from 'react-icons/tb';

const QuizCard = ({ quiz }) => {

    const [attempted, setAttempted] = useState(false)
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        setAttempted(user?.attemptedQuizzes?.includes(quiz._id) ? true : false)
    }, [user, quiz._id])

    return (
        <Link to={`/quiz/${quiz._id}`} className='surface-card surface-card-hover group relative flex min-h-56 flex-col overflow-hidden p-5'>
            <div className="mb-4 flex items-start justify-between gap-3">
                <span className='chip text-indigo-700 dark:text-indigo-300'>
                    <TbClock size={17} />
                    {quiz.timer} min
                </span>
                {attempted && (
                    <span className='rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'>Completed</span>
                )}
            </div>

            <h2 className='line-clamp-2 text-xl font-bold text-slate-950 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300'>{quiz.title}</h2>
            <p className='muted-text mt-3 line-clamp-3 flex-1 leading-relaxed'>{quiz.description}</p>

            <div className='mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-800'>
                <span className='muted-text flex items-center gap-2'>
                    <TbUser size={17} />
                    {quiz.createdBy.username}
                </span>
                <span className='muted-text'>{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</span>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                <span>Start quiz</span>
                <TbArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </div>
        </Link>
    )
}

export default QuizCard
