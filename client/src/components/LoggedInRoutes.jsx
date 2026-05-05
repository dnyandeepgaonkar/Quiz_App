import { useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const LoggedInRoutes = ({ children, theme, toggleTheme }) => {

    const navigate = useNavigate();
    const { token, user } = useSelector(state => state.auth)

    useEffect(() => {
        if (!token || !user) {
            navigate('/login')
            return
        }
    }, [token, user, navigate])

    return (
        <div className=''>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            {children}
        </div>
    )
}

export default LoggedInRoutes
