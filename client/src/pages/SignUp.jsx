import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import RequiredError from '../components/RequiredError'
import { signUp } from '../services/operations/AuthAPIs'
import { TbEyeClosed, TbEyeCheck } from "react-icons/tb"
import ThemeToggle from '../components/ThemeToggle'

const SignUp = ({ theme, toggleTheme }) => {
  const [hidePassword, setHidePassword] = useState({
    password: true,
    confirmPassword: true,
  })
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const navigate = useNavigate()

  const submitHandler = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Creating account...")
    try {
      const response = await signUp(data)
      if (response) {
        toast.success("Account created successfully!")
        navigate("/login")
      }
    } catch (e) {
      console.log("ERROR WHILE SIGNING UP: ", e)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  useEffect(() => {
    setValue("role", "user")
  }, [setValue])

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12'>
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <section className='relative z-10 w-full max-w-lg animate-scale-in'>
        <div className="text-center mb-8">
          <h1 className='text-5xl font-black tracking-tight text-gradient'>
            Quizzy
          </h1>
          <p className="muted-text mt-3 text-lg">Create your workspace and start building momentum.</p>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className='glass-card flex flex-col gap-5 p-8 sm:p-10'
        >
          {loading && (
            <div className='rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-center text-sm font-medium text-indigo-700 dark:text-indigo-300'>
              Setting up your account...
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <label htmlFor="username" className="label-text">Username</label>
            <input
              id='username'
              placeholder='Choose a username'
              className='input-field'
              type="text"
              {...register("username", { required: "Username is required" })}
            />
            {errors?.username && <RequiredError>{errors.username.message}</RequiredError>}
          </div>

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

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="password" className="label-text">Password</label>
              <div className='relative w-full'>
                <input
                  id='password'
                  placeholder='Password'
                  className='input-field pr-12'
                  type={hidePassword.password ? "password" : "text"}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  onClick={() => setHidePassword((prev) => ({ ...prev, password: !hidePassword.password }))}
                >
                  {hidePassword.password ? <TbEyeClosed size={20} /> : <TbEyeCheck size={20} />}
                </button>
              </div>
              {errors?.password && <RequiredError>{errors.password.message}</RequiredError>}
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="confirmPassword" className="label-text">Confirm</label>
              <div className='relative w-full'>
                <input
                  id='confirmPassword'
                  placeholder='Confirm Password'
                  className='input-field pr-12'
                  type={hidePassword.confirmPassword ? "password" : "text"}
                  {...register("confirmPassword", { required: "Re-enter password" })}
                />
                <button
                  type="button"
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  onClick={() => setHidePassword((prev) => ({ ...prev, confirmPassword: !hidePassword.confirmPassword }))}
                >
                  {hidePassword.confirmPassword ? <TbEyeClosed size={20} /> : <TbEyeCheck size={20} />}
                </button>
              </div>
              {errors?.confirmPassword && <RequiredError>{errors.confirmPassword.message}</RequiredError>}
            </div>
          </div>

          <div className='flex flex-col gap-2 mt-2'>
            <label className="label-text">Account Type</label>
            <div className='flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-950/70'>
              <button
                type="button"
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${role === "user" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
                onClick={(e) => {
                  e.preventDefault()
                  setValue("role", "user")
                  setRole("user")
                }}>
                User
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${role === "admin" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
                onClick={(e) => {
                  e.preventDefault()
                  setValue("role", "admin")
                  setRole("admin")
                }}>
                Admin
              </button>
            </div>
          </div>

          <div className='mt-4'>
            <Button disabled={loading} active={true} type={"submit"}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>

          <p className='muted-text mt-2 text-center'>
            Already have an account?{' '}
            <Link to="/login" className='font-semibold text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200'>
              Log In
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}

export default SignUp
