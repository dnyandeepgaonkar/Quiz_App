import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../Button';

const AttemptCard = ({ item }) => {

    const navigate = useNavigate();

    return (
        <div className='surface-card surface-card-hover flex flex-col gap-4 p-5'>
            <span className=''>
                <h3 className='line-clamp-2 text-lg font-bold text-slate-950 dark:text-white md:text-xl'>{item?.quizId?.title}</h3>
                <p className='muted-text mt-2 line-clamp-2 text-sm md:text-base'>{item?.quizId?.description}</p>
                <span className='muted-text mt-3 block text-xs md:text-sm'>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
            </span>
            <span>
                <h3 className='my-2 flex items-center justify-center gap-3 text-base font-semibold text-slate-700 dark:text-slate-300 md:text-xl'>Score <span className='text-xl font-bold md:text-3xl'><span className={`${item?.score / item.answers.length >= 0.4 ? "text-emerald-500" : "text-red-500"} `}>{item?.score}</span> / {item?.answers?.length}</span></h3>
            </span>
            <Button onClick={() => navigate(`../../quiz/${item?.quizId?._id}`)}>Attempt Again</Button>
        </div>
    )
}

export default AttemptCard
