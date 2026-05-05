import React from 'react';

const QuestionCard = React.memo(({ question, index, selectedAnswer, onAnswerChange }) => {
    const handleOptionChange = (event) => {
        onAnswerChange(question._id, event.target.value);
    };

    return (
        <div className='glass-card group relative w-full overflow-hidden p-6 animate-fade-up'>
            <div className='absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 opacity-80 transition-colors group-hover:bg-indigo-600 dark:bg-slate-800'>
                <span className='mr-3 mt-3 text-xl font-bold text-slate-500 group-hover:text-white dark:text-slate-400'>{index}</span>
            </div>

            <h3 className='mb-6 pr-8 text-xl font-semibold leading-relaxed text-slate-950 dark:text-white'>{question.questionText}</h3>
            
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {question.options.map((option) => (
                    <label 
                        key={option._id} 
                        className={`group/label flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15 ${
                            selectedAnswer === option._id
                                ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm dark:bg-indigo-500/15 dark:text-indigo-100"
                                : "border-slate-200 bg-white/70 hover:border-indigo-300 hover:bg-indigo-50/60 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                                type='radio'
                                name={question._id}
                                value={option._id}
                                checked={selectedAnswer === option._id}
                                onChange={handleOptionChange}
                                className='peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-slate-400 transition-colors checked:border-indigo-500 checked:bg-transparent'
                            />
                            <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className='font-medium text-slate-700 transition-colors group-hover/label:text-slate-950 dark:text-slate-300 dark:group-hover/label:text-white'>{option.text}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;
