import React from 'react'

interface InputProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({ name, label, placeholder, type, value, onChange }: InputProps) => {
  return (
    <span className='rounded-lg flex flex-col '>
        <label 
            htmlFor={name} 
            className='text-base flex gap-1'>
                {label}
                <span className='text-rose-500'>*</span>
        </label>
        <input
            name={name} 
            type={type} 
            placeholder={placeholder}
            className='p-3 px-5 rounded-xs bg-neutral-200'
            value={value}
            onChange={onChange}
        >
        </input>
    </span>
  )
}

export default Input