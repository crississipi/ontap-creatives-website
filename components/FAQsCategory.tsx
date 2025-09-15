"use client";

import React, { useState } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi2';

interface FAQsProps {
    topic: string;
    questions: string[];
    qNum: number;
    setSelectedQuestion: (selectedQuestion: [number, number]) => void;
}

const FAQsCategory = ({ topic, questions, qNum, setSelectedQuestion }: FAQsProps) => {
  const [showQA, setShowQA] = useState(false);
  
  return (
    <div className='h-auto flex flex-col w-full'>
        <button type="button" className={`flex gap-2 px-3 items-center w-full text-left py-3 ${showQA && 'bg-light-blue'}`} onClick={() => setShowQA(!showQA)}>
            <strong className='text-sm'>{qNum + 1}.</strong>
            <p className='text-nowrap'>{topic}</p>
            <HiOutlineChevronRight className={`${showQA && 'rotate-90'} text-xl ml-auto`} />
        </button>
        {showQA && (
            <div className='flex flex-col w-full'>
                {questions.map((val,i) => (
                    <button 
                        key={`questions_${i}`} 
                        type="button" 
                        className='w-full text-left px-5 border-b border-light-blue py-2 hover:bg-light-blue/30 focus:bg-light-blue/50 ease-out duration-200'
                        onClick={() => setSelectedQuestion([qNum, i])}
                    ><strong className='mr-3 text-xs'>{qNum + 1}.{i + 1}</strong>{val}</button>
                ))}
            </div>
        )}
    </div>
  )
}

export default FAQsCategory