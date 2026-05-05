import { TbMoon, TbSun } from "react-icons/tb";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group inline-flex h-10 w-20 items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-all duration-300 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/60"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 ${
          isDark ? "translate-x-10" : "translate-x-0"
        }`}
      >
        {isDark ? <TbMoon size={18} /> : <TbSun size={18} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
