import { useCallback, useEffect, useState } from 'react'
import { apiConnector, getErrorMessage } from "../services/apiConnector"
import { quizEndpoints } from '../services/APIs';
import { useSelector } from "react-redux"
import QuizCard from '../components/core/AdminQuizes/QuizCard';
import { deleteQuiz } from '../services/operations/QuizAPIs';
import { TbFolderOff } from 'react-icons/tb'
import toast from 'react-hot-toast';

const AdminQuizes = () => {
    const [quizes, setQuizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector(state => state.auth);

    const handleDeleteQuiz = async (id) => {
        try {
            setLoading(true);

            const response = await deleteQuiz(id, token)
            if (response) {
                setQuizes(quizes.filter(quiz => quiz._id !== id));
            }

        } catch (e) {
            console.log("ERROR DELETING QUIZ : ", e);
            toast.error(getErrorMessage(e, "Failed to delete quiz"));
        } finally {
            setLoading(false);
        }
    }

    const fetchAdminQuizes = useCallback(async () => {
        try {
            const response = await apiConnector("GET", quizEndpoints.GET_ADMIN_QUIZES, null, {
                Authorization: `Bearer ${token}`
            })

            setQuizes(response?.data?.data);
        } catch (error) {
            console.error('Error fetching admin quizes:', error);
            toast.error(getErrorMessage(error, "Failed to fetch quizzes"));
        } finally {
            setLoading(false);
        }
    }, [token])

    useEffect(() => {
        fetchAdminQuizes();
    }, [fetchAdminQuizes])

  return (
        <section className='py-8 animate-fade-up'>
            <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Admin Studio</p>
                    <h1 className='page-title mt-2'>Manage Your Quizzes</h1>
                </div>
            </div>

            {loading ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {[1, 2, 3].map((item) => <div key={item} className="skeleton-card h-56" />)}
                </div>
            ) : quizes.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {quizes.map((quiz, index) => (
                        <QuizCard handleDeleteQuiz={handleDeleteQuiz} key={quiz._id} quiz={quiz} index={index} />
                    ))}
                </div>
            ) : (
                <div className='glass-card flex min-h-[50vh] flex-col items-center justify-center p-10 text-center'>
                    <TbFolderOff size={64} className="mb-4 text-slate-400" />
                    <h2 className='section-title mb-2'>No Quizzes Created</h2>
                    <p className='muted-text'>You haven&apos;t created any quizzes yet. Start creating to see them here.</p>
                </div>
            )}
        </section>
    )
}

export default AdminQuizes
