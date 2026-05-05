const RequiredError = ({ children }) => {
    return (
        <span className='pt-1 text-end text-sm font-medium text-red-500 dark:text-red-400'>{children}</span>
    )
}

export default RequiredError
