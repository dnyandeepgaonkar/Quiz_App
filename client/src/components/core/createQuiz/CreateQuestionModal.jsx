import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../Button';
import { IoAdd, IoClose } from "react-icons/io5";
import { getErrorMessage } from '../../../services/apiConnector';
import { createQuestion } from '../../../services/operations/questionAPIs';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CreateQuestionModal = ({ quiz, setQuestions, setCreateQuestionModalData }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOption, setCurrentOption] = useState('');
  const [isCurrentOptionCorrect, setIsCurrentOptionCorrect] = useState(false);
  const [optionError, setOptionError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useSelector(state => state.auth);

  const submitHandler = async (data) => {
    if (!options.some(option => option.isCorrect)) {
      setOptionError("There must be at least one correct option.");
      return;
    }
    setLoading(true)
    data.options = options;
    data.quizId = quiz._id;

    try {
      const response = await createQuestion(data, token);

      if (response) {
        setQuestions(prevQuestions => [...prevQuestions, response]);
        setCreateQuestionModalData(null);
      }

    } catch (e) {
      console.log("ERROR WHILE CREATING THE QUESTION:", e);
      toast.error(getErrorMessage(e, "Question cannot be created"));
    } finally {
      setLoading(false)
    }
  };

  const addOption = () => {
    if (isCurrentOptionCorrect && options.some(option => option.isCorrect)) {
      alert("There can be only one correct option.");
      return;
    }
    setOptions([...options, { text: currentOption, isCorrect: isCurrentOptionCorrect }]);
    if (isCurrentOptionCorrect) {
      setOptionError("");
    }
    setCurrentOption('');
    setIsCurrentOptionCorrect(false);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm'>
      <div className='glass-card flex max-h-[90vh] w-full max-w-[520px] animate-scale-in flex-col gap-6 overflow-y-auto p-6'>
      <h3 className='section-title text-2xl'>Create a question</h3>
      <form onSubmit={handleSubmit(submitHandler)} className='flex w-full flex-col gap-5'>

        <span className='flex flex-col gap-3'>
          <label className="label-text" htmlFor="questionText">Enter Question</label>
          <input
            type="text"
            placeholder='Enter Question here'
            className='input-field'
            {...register("questionText", {
              required: "Question is required",
            })}
          />
          {errors.questionText && <p className='text-sm font-medium text-red-500'>{errors.questionText.message}</p>}
        </span>

        <span className='flex flex-col gap-3'>
          <label className="label-text" htmlFor="options">Add Options</label>
          <span className='flex items-center flex-col gap-2'>
            <input
              type="text"
              placeholder='Create Options'
              className='input-field'
              value={currentOption}
              onChange={(e) => setCurrentOption(e.target.value)}
            />
            <span className='flex w-full items-center justify-between gap-2 self-start'>
              <span className='flex items-center gap-2'>
                <input
                  type="checkbox"
                  name="isCorrect"
                  id="isCorrect"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={isCurrentOptionCorrect}
                  onChange={() => setIsCurrentOptionCorrect(!isCurrentOptionCorrect)}
                />
                <label className="label-text" htmlFor="isCorrect">Correct option?</label>
              </span>
              <button onClick={addOption} className='inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10' type='button'><IoAdd /> Add</button>
            </span>
          </span>
        </span>

        <span className='flex flex-col gap-1'>
          {options.map((option, index) => (
            <div key={index} className='flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60'>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.text}</p>
              <span className="flex items-center gap-2">
                {option.isCorrect && <span className='text-xs font-bold text-emerald-500'>Correct</span>}
                <button type='button' onClick={() => removeOption(index)} className='rounded-lg p-1 text-red-500 transition hover:bg-red-500/10'><IoClose /></button>
              </span>
            </div>
          ))}
        </span>

        {optionError && <p className='text-sm font-medium text-red-500'>{optionError}</p>}

        <span className='flex justify-end w-full gap-3'>
          <Button onClick={() => setCreateQuestionModalData(null)} className='w-max h-max' active={false}>Cancel</Button>
          <Button type="submit" disabled={loading} className='w-max h-max' active>Create</Button>
        </span>

      </form>
      </div>
    </div>
  );
};

export default CreateQuestionModal;
