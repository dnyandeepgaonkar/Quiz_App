import { useState } from 'react'
import Score from './Score';
import { TbChevronUp, TbClock, TbEdit, TbTrash } from "react-icons/tb";
import Button from '../../Button';
import { useDispatch } from 'react-redux';
import { setEdit, setQuiz } from '../../../slices/QuizSlice';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz, handleDeleteQuiz }) => {

    const [showDetails, setShowDetails] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEditQuiz = () => {
        dispatch(setQuiz(quiz))
        dispatch(setEdit(true))
        navigate(`/dashboard/edit-quiz/${quiz._id}`)
    }

    return (
        <>
            <div className='surface-card surface-card-hover relative px-5 py-4'>
                <span onClick={() => setShowDetails(!showDetails)} className='flex cursor-pointer items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800'>
                    <h3 className='line-clamp-1 text-xl font-bold text-slate-950 dark:text-white'>{quiz.title}</h3>
                    <p className={`${!showDetails ? "rotate-180" : "rotate-0"} transition-all duration-300 text-slate-500`}><TbChevronUp /></p>
                </span>
                <div className='flex flex-col justify-between gap-y-4 pt-4'>
                    <span>
                        <p className='muted-text line-clamp-3'>{quiz.description}</p>
                        <p className='chip mt-4 w-max'><TbClock /> {quiz.timer} minutes</p>
                    </span>
                    <span className='flex items-center justify-end gap-3'>
                        <Button onClick={() => handleDeleteQuiz(quiz._id)} className='w-max' active={false} ><TbTrash /> Delete</Button>
                        <Button onClick={handleEditQuiz} className='w-max' active ><TbEdit /> Edit</Button>
                    </span>
                </div>
                {
                    showDetails &&
                    <Score quiz={quiz} />
                }
            </div>
        </>
    )
}

export default QuizCard
