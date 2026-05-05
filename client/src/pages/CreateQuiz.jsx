import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button';
import RequiredError from '../components/RequiredError';
import toast from 'react-hot-toast';
import { createQuiz, updateQuiz } from '../services/operations/QuizAPIs';
import { getErrorMessage } from '../services/apiConnector';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setEdit, setQuiz } from '../slices/QuizSlice';
import { IoMdArrowForward } from "react-icons/io";

const CreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const { token } = useSelector((state) => state.auth);
  const { edit, quiz } = useSelector((state) => state.quiz);
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { id: quizId } = useParams()

  const submitHandler = async (data) => {
    setLoading(true);
    const toastId = toast.loading(edit ? "Updating quiz..." : "Creating quiz...");
    try {
      if (edit) {
        const response = await updateQuiz(data, token, quizId);
        if (response) {
          toast.success("Quiz Updated Successfully");
          navigate("/dashboard/create-quiz/" + response._id)
        }
        return
      }

      const response = await createQuiz(data, token);
      if (response) {
        dispatch(setQuiz(response))
        toast.success("Quiz Created Successfully");
        navigate("/dashboard/create-quiz/" + response._id)
      }
    } catch (e) {
      console.log(e);
      toast.error(getErrorMessage(e, edit ? "Failed to update quiz" : "Failed to create quiz"))
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  }

  useEffect(() => {
    if (edit && quiz) {
      setValue("title", quiz.title)
      setValue("description", quiz.description)
      setValue("timer", quiz.timer)
    }

    if (location.pathname === "/dashboard/create-quiz" && edit) {
      dispatch(setEdit(false))
      dispatch(setQuiz(null))
      reset();
    }
  }, [dispatch, edit, quiz, setValue, location.pathname, reset])

  return (
    <div className='relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-10 animate-fade-up'>
      <div className='relative z-10 w-full max-w-xl'>
        <div className="text-center mb-8">
            <h1 className='text-gradient text-4xl font-black tracking-tight'>
              {edit ? "Edit Quiz Settings" : "Create a New Quiz"}
            </h1>
            <p className="muted-text mt-3 text-lg">Fill in the details below to set up your quiz.</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className='glass-card flex flex-col gap-6 p-8 sm:p-10'>
          
          <div className='flex flex-col gap-2'>
            <label htmlFor="title" className="label-text">Quiz Title</label>
            <input
              type="text"
              placeholder='Enter an engaging title'
              id='title'
              className='input-field'
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <RequiredError>{errors.title.message}</RequiredError>}
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="description" className="label-text">Description</label>
            <textarea
              placeholder='What is this quiz about?'
              rows={4}
              id='description'
              className='input-field resize-none'
              {...register("description")}
            ></textarea>
            {errors.description && <RequiredError>{errors.description.message}</RequiredError>}
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="timer" className="label-text">Time Limit (minutes)</label>
            <input
              type="number"
              placeholder='e.g. 10'
              id='timer'
              min={1}
              max={120}
              className='input-field'
              {...register("timer", { 
                required: "Time limit is required",
                min: { value: 1, message: "Minimum time is 1 minute" },
                max: { value: 120, message: "Maximum time is 120 minutes" }
              })}
            />
            {errors.timer && <RequiredError>{errors.timer.message}</RequiredError>}
          </div>

          <div className='flex flex-col sm:flex-row gap-4 mt-4'>
            <Button disabled={loading} type='submit' className="flex-1">
              {loading ? "Processing..." : (edit ? "Save Changes" : "Create Quiz")}
            </Button>
            
            {edit && (
              <Button
                type='button'
                active={false}
                className='flex-1'
                onClick={() => navigate("/dashboard/create-quiz/" + quiz._id)}
              >
                Skip to Questions <IoMdArrowForward size={18} />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz
