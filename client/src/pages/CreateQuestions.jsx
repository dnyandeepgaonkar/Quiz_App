import { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { apiConnector, getErrorMessage } from '../services/apiConnector';
import { questionEndpoints } from '../services/APIs';
import Button from '../components/Button';
import CreateQuestionModal from '../components/core/createQuiz/CreateQuestionModal';
import QuestionCard from "../components/core/createQuiz/QuestionCard"
import { deleteQuestion } from '../services/operations/questionAPIs';
import { setQuiz, setEdit } from '../slices/QuizSlice';
import { TbPlus, TbCheck, TbClipboardList } from 'react-icons/tb';
import toast from 'react-hot-toast';

const CreateQuestions = () => {
    const { quiz, edit } = useSelector(state => state.quiz);
    const { token } = useSelector(state => state.auth);

    const [questions, setQuestions] = useState([]);
    const [createQuestionModalData, setCreateQuestionModalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const finishHandler = () => {
        navigate("/dashboard/quizes")
        dispatch(setQuiz(null))
        dispatch(setEdit(false))
    }

    const deleteQuestionHandler = async (question) => {
        try {
            const response = await deleteQuestion(question._id, token)
            if (response) {
                setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== question._id))
            }
        } catch (e) {
            console.log("ERROR DELETING QUESTION : ", e);
            toast.error(getErrorMessage(e, "Failed to delete question"));
        }
    }

    const fetchQuestions = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${id}`, null, {
                Authorization: `Bearer ${token}`
            })
            if (response) {
                setQuestions(response?.data?.data);
            }
        } catch (error) {
            console.log("ERROR FETCHING QUIZ QUESTIONS : ", error);
            toast.error(getErrorMessage(error, "Failed to fetch quiz questions"));
        } finally {
            setLoading(false)
        }
    }, [id, token])

    useEffect(() => {
        if (quiz === null) {
            navigate("/dashboard/create-quiz")
        }
    }, [quiz, navigate])

    useEffect(() => {
        if (edit) {
            fetchQuestions();
        }
    }, [quiz, edit, id, fetchQuestions]);

    return (
        <>
            <div className='mx-auto max-w-5xl py-8 animate-fade-up'>
                <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-center">
                    <div>
                        <h1 className='page-title flex items-center gap-3'>
                            <TbClipboardList className="text-indigo-500" />
                            Manage Questions
                        </h1>
                        <p className='muted-text mt-2 line-clamp-1'>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{quiz?.title}</span> - {quiz?.description}
                        </p>
                    </div>
                    
                    <Button
                        onClick={() => setCreateQuestionModalData({ ...quiz })}
                        className='w-full md:w-max whitespace-nowrap'
                        active
                    >
                        <TbPlus size={20} /> Add New Question
                    </Button>
                </div>

                <div className='w-full flex flex-col gap-6 min-h-[50vh]'>
                    {loading ? (
                        <div className='flex justify-center items-center py-20'>
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className='glass-card flex flex-col items-center justify-center border-2 border-dashed border-slate-300 py-20 text-center dark:border-slate-700'>
                            <TbClipboardList size={64} className="mb-4 text-slate-400" />
                            <h3 className="section-title mb-2">No Questions Yet</h3>
                            <p className="muted-text max-w-sm">Start building your quiz by adding your first question using the button above.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {questions.map((ques, index) => (
                                <div className="relative group" key={ques?._id}>
                                    <div className="absolute -left-3 -top-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                                        {index + 1}
                                    </div>
                                    <QuestionCard
                                        deleteQuestionHandler={deleteQuestionHandler}
                                        question={ques}
                                        quiz={quiz}
                                        setCreateQuestionModalData={setCreateQuestionModalData}
                                        setQuestions={setQuestions}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='mt-8 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800'>
                    <Button active className='w-full md:w-auto md:min-w-[200px]' onClick={finishHandler}>
                        <TbCheck size={20} /> Finish & Save Quiz
                    </Button>
                </div>
            </div>

            {createQuestionModalData && (
                <CreateQuestionModal
                    quiz={createQuestionModalData}
                    setCreateQuestionModalData={setCreateQuestionModalData}
                    setQuestions={setQuestions}
                />
            )}
        </>
    )
}

export default CreateQuestions
