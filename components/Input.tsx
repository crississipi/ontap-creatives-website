import React from 'react'

interface InputProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}
const Input = ({ name, label, placeholder, type, value, onChange, error }: InputProps) => {
  return (
    <div className='flex flex-col gap-2'>
        <label 
            htmlFor={name} 
            className='text-sm font-medium text-gray-700 flex gap-1'>
                {label}
                <span className='text-rose-500'>*</span>
        </label>
        <input
            id={name}
            name={name} 
            type={type} 
            placeholder={placeholder}
            className={`w-full p-3 px-4 rounded-lg bg-gray-50 text-sm transition-all duration-200 outline-none border ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/20'
            }`}
            value={value}
            onChange={onChange}
        />
        {error && <span className='text-xs text-red-500 ml-1'>{error}</span>}
    </div>
  )
}

export default Input