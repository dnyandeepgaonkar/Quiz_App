import { Route, Routes } from "react-router-dom"
import { Suspense, lazy, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import LoggedInRoutes from "./components/LoggedInRoutes"
import DashboardLayout from "./components/DashboardLayout"

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"))
const SignUp = lazy(() => import("./pages/SignUp"))
const LogIn = lazy(() => import("./pages/LogIn"))
const Profile = lazy(() => import("./pages/Profile"))
const CreateQuiz = lazy(() => import("./pages/CreateQuiz"))
const CreateQuestions = lazy(() => import("./pages/CreateQuestions"))
const AdminQuizes = lazy(() => import("./pages/AdminQuizes"))
const AttemptQuiz = lazy(() => import("./pages/AttemptQuiz"))
const QuizResult = lazy(() => import("./pages/QuizResult"))
const History = lazy(() => import("./pages/History"))

// Loading Spinner for Suspense fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      <p className="muted-text text-sm font-medium">Loading workspace...</p>
    </div>
  </div>
);

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("quizzy-theme")
    if (savedTheme) return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("quizzy-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="app-shell selection:bg-indigo-500/25">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: theme === "dark" ? "#0f172a" : "#ffffff",
          color: theme === "dark" ? "#f8fafc" : "#0f172a",
          border: theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
          borderRadius: "14px",
        },
      }} />
      <div className="max-w-[1200px] px-4 md:px-6 mx-auto min-h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><Home /></LoggedInRoutes>} />
            <Route path="/quiz/:id" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><AttemptQuiz /></LoggedInRoutes>} />
            <Route path="/quiz-results" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><QuizResult /></LoggedInRoutes>} />
            <Route path="/login" element={<LogIn theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/signup" element={<SignUp theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/dashboard">
              <Route index element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><Profile /></DashboardLayout></LoggedInRoutes>} />
              <Route path="history" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><History /></DashboardLayout ></LoggedInRoutes>} />
              <Route path="create-quiz" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><CreateQuiz /></DashboardLayout ></LoggedInRoutes>} />
              <Route path="create-quiz/:id" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><CreateQuestions /></DashboardLayout ></LoggedInRoutes>} />
              <Route path="quizes" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><AdminQuizes /></DashboardLayout></LoggedInRoutes>} />
              <Route path="edit-quiz/:id" element={<LoggedInRoutes theme={theme} toggleTheme={toggleTheme}><DashboardLayout><CreateQuiz /></DashboardLayout></LoggedInRoutes>} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
