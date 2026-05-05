import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import RequiredError from '../components/RequiredError'
import { login } from '../services/operations/AuthAPIs'
import { TbEyeClosed, TbEyeCheck } from "react-icons/tb"
import toast from 'react-hot-toast'
import ThemeToggle from '../components/ThemeToggle'

const LogIn = ({ theme, toggleTheme }) => {
  const [hidePassword, setHidePassword] = useState(true)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitHandler = async (data) => {
    setLoading(true)
    const toastId = toast.loading("Logging in...")
    try {
      const response = await login(data, dispatch)
      if (response) {
        toast.success("Welcome back!")
        navigate("/dashboard")
      }
    } catch (e) {
      console.log("ERROR WHILE LOGGING IN: ", e)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12'>
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <section className='relative z-10 w-full max-w-md animate-scale-in'>
        <div className="text-center mb-8">
          <h1 className='text-5xl font-black tracking-tight text-gradient'>
            Quizzy
          </h1>
          <p className="muted-text mt-3 text-lg">Welcome back. Sign in to continue learning.</p>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className='glass-card flex flex-col gap-6 p-8 sm:p-10'
        >
          {loading && (
            <div className='rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-center text-sm font-medium text-indigo-700 dark:text-indigo-300'>
              Authenticating, please wait...
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <label htmlFor="email" className="label-text">Email Address</label>
            <input
              id='email'
              placeholder='Enter your email'
              className='input-field'
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors?.email && <RequiredError>{errors.email.message}</RequiredError>}
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="password" className="label-text">Password</label>
            <div className='relative w-full'>
              <input
                id='password'
                placeholder='Enter your password'
                className='input-field pr-12'
                type={hidePassword ? "password" : "text"}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className='absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                onClick={() => setHidePassword(!hidePassword)}
              >
                {hidePassword ? <TbEyeClosed size={20} /> : <TbEyeCheck size={20} />}
              </button>
            </div>
            {errors?.password && <RequiredError>{errors.password.message}</RequiredError>}
          </div>

          <div className='mt-2'>
            <Button disabled={loading} active={true} type={"submit"}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>

          <p className='muted-text mt-2 text-center'>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className='font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200'>
              Sign Up
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}

export default LogIn
