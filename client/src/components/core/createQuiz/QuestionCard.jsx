import Button from '../../Button';

const QuestionCard = ({ question, deleteQuestionHandler }) => {

  return (
    <div>
      <div className='surface-card space-y-4 px-5 py-4'>
        <span className='flex justify-between gap-5 border-b border-slate-200 pb-3 dark:border-slate-800'>
          <h4 className='line-clamp-1 text-xl font-semibold text-slate-950 dark:text-white'>{question.questionText}</h4>
        </span>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3' >
          {
            question.options.map((option) => (
              <div key={option._id} className={`${option.isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"} rounded-xl border px-3 py-2 text-sm font-medium md:text-base`}>
                {option?.text}
              </div>
            ))
          }
        </div>
        <div className='flex justify-end py-3'>
          <Button
            onClick={() => deleteQuestionHandler(question)}
            className='w-max h-max'
            active={false}
          >delete</Button>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
