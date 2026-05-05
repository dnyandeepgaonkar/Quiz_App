import { useLocation } from 'react-router-dom'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/operations/AuthAPIs'
import { useDispatch, useSelector } from 'react-redux'
import { TbUserCircle, TbPlus, TbFolder, TbHistory, TbLogout } from 'react-icons/tb'

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)

    return (
        <section className='pb-10 animate-fade-up'>
            <div className='surface-card my-6 flex flex-col items-center justify-between gap-y-5 px-4 py-4 md:flex-row md:px-5'>
                <div className='flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base font-medium w-full md:w-auto'>
                    <NavLink to={"/dashboard"} className={`nav-pill ${location.pathname === "/dashboard" ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                        <TbUserCircle size={18} /> Profile
                    </NavLink>
                    {user.role === "admin" ? (
                        <>
                            <Link to={"/dashboard/create-quiz"} className={`nav-pill ${location.pathname.includes("create") ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                                <TbPlus size={18} /> Create Quiz
                            </Link>
                            <Link to={"/dashboard/quizes"} className={`nav-pill ${location.pathname.includes("quizes") ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                                <TbFolder size={18} /> Manage Quizzes
                            </Link>
                        </>
                    ) : (
                        <Link to={"/dashboard/history"} className={`nav-pill ${location.pathname.includes("history") ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                            <TbHistory size={18} /> History
                        </Link>
                    )}
                </div>
                
                <button 
                    onClick={() => logout(dispatch, navigate)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-red-500 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 md:w-auto md:text-base"
                >
                    <TbLogout size={18} /> Logout
                </button>
            </div>
            
            <div className="surface-card min-h-[50vh] p-3 md:p-6">
                {children}
            </div>
        </section>
    )
}

export default DashboardLayout
