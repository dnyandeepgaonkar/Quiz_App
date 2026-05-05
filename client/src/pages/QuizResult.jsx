import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { TbTrophy, TbMoodSad } from 'react-icons/tb';

const QuizResults = () => {
    const location = useLocation();
    const { score, total, passed } = location.state || { score: 0, total: 0, passed: false };
    const navigate = useNavigate();

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <div className='relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-12 animate-scale-in'>
            <div className='glass-card relative z-10 flex w-full max-w-lg flex-col items-center p-10 text-center'>
                <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl ${passed ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-green-500/30' : 'bg-gradient-to-br from-orange-400 to-red-600 shadow-red-500/30'}`}>
                    {passed ? <TbTrophy size={48} className="text-white" /> : <TbMoodSad size={48} className="text-white" />}
                </div>

                <h1 className='page-title mb-2 text-4xl'>Quiz Completed!</h1>
                <p className='muted-text mb-8'>{passed ? "Great job! You've passed the quiz." : "Keep practicing! You didn't pass this time."}</p>

                <div className='mb-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700/50 dark:bg-slate-950/50'>
                    <div className='mb-2 text-5xl font-black'>
                        <span className={passed ? "text-emerald-500" : "text-red-500"}>{score}</span>
                        <span className='text-3xl font-medium text-slate-400'> / {total}</span>
                    </div>
                    <div className="my-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className={`h-full rounded-full transition-all duration-700 ${passed ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
                    </div>
                    <p className='muted-text text-sm font-semibold uppercase tracking-widest'>Total Score ({percentage}%)</p>
                </div>

                <div className='flex gap-4 w-full'>
                    <Button active={false} className='flex-1' onClick={() => navigate("/dashboard/history")}>View History</Button>
                    <Button active={true} className='flex-1' onClick={() => navigate("/")}>Go Home</Button>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
