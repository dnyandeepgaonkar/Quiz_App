import { Link, NavLink } from 'react-router-dom'
import { TbBrain, TbLayoutDashboard, TbHome } from 'react-icons/tb'
import ThemeToggle from './ThemeToggle'

const Navbar = ({ theme, toggleTheme }) => {
    return (
        <nav className='sticky top-0 z-40 mb-5 flex items-center justify-between border-b border-slate-200/70 bg-slate-50/75 py-4 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70'>
            <Link to={"/"} className='flex items-center gap-2 text-2xl font-black tracking-tight text-gradient transition-opacity hover:opacity-80 md:text-3xl'>
                <TbBrain size={32} className="text-indigo-500 dark:text-indigo-300" />
                Quizzy
            </Link>
            <div className='flex items-center gap-2 sm:gap-3'>
                <NavLink to={"/"} className={({ isActive }) => `nav-pill ${isActive ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                    <TbHome size={18} />
                    <span className="hidden sm:inline">Home</span>
                </NavLink>
                <NavLink to={"/dashboard"} className={({ isActive }) => `nav-pill ${isActive ? "nav-pill-active" : "text-slate-600 dark:text-slate-300"}`}>
                    <TbLayoutDashboard size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </nav>
    )
}

export default Navbar
