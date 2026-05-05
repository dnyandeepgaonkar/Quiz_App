import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns';
import Button from "../components/Button"
import { FaHome, FaUserCircle } from "react-icons/fa";
import { TbShieldCheck, TbCalendarStats } from "react-icons/tb";

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate();

  return (
    <section className='py-8 animate-fade-up'>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Dashboard</p>
        <h1 className='page-title mt-2'>Your Profile</h1>
      </div>
      
      <div className='glass-card flex flex-col items-start gap-8 p-6 md:flex-row md:p-8'>
        <div className='mx-auto shrink-0 rounded-full border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/30 dark:bg-indigo-600/20 md:mx-0'>
           <FaUserCircle size={80} className="text-indigo-400" />
        </div>
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
          <div className='surface-card p-4'>
             <p className='muted-text mb-1 text-sm'>Username</p>
             <p className='text-xl font-semibold text-slate-950 dark:text-white'>{user.username}</p>
          </div>
          <div className='surface-card p-4'>
             <p className='muted-text mb-1 text-sm'>Email</p>
             <p className='truncate text-xl font-semibold text-slate-950 dark:text-white'>{user.email}</p>
          </div>
          <div className='surface-card p-4'>
             <p className='muted-text mb-1 flex items-center gap-2 text-sm'><TbCalendarStats /> Joined</p>
             <p className='text-xl font-semibold text-slate-950 dark:text-white'>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
          </div>
          <div className='surface-card p-4'>
             <p className='muted-text mb-1 flex items-center gap-2 text-sm'><TbShieldCheck /> Role</p>
             <p className='text-xl font-semibold capitalize text-slate-950 dark:text-white'>{user.role}</p>
          </div>
        </div>
      </div>

      <div className='mt-8 max-w-xs'>
          <Button onClick={() => navigate('/')} className='flex gap-3 justify-center items-center py-3'>
            <FaHome size={20} /> Return to Home
          </Button>
      </div>
    </section>
  )
}

export default Profile
