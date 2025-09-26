"use client";

import { EditProps } from '@/types';
import React, { useState } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { EditableText } from '.';

interface FAQsProps {
    topic: string;
    questions: string[];
    qNum: number;
    setSelectedQuestion: (selectedQuestion: [number, number]) => void;
}

type FAQs = FAQsProps & EditProps;

const FAQsCategory = ({ topic, questions, qNum, setSelectedQuestion, editable }: FAQs) => {
  const [showQA, setShowQA] = useState(false);
  
  return (
    <div className='h-auto flex flex-col w-full'>
        <button type="button" className={`flex gap-2 px-3 items-center w-full text-left py-3 ${showQA && 'bg-light-blue'}`} onClick={() => setShowQA(!showQA)}>
            <strong className='text-sm'>{qNum + 1}.</strong>
            {editable ? 
                <EditableText tag="p" className="text-nowrap w-full" type='input'>
                    {topic}
                </EditableText>    
                : 
                <p className='text-nowrap'>{topic}</p>
            }
            
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
                    >
                        <strong className='mr-3 text-xs'>{qNum + 1}.{i + 1}</strong>
                        {editable ? (
                            <EditableText tag="span" type='input' className='w-full '>
                                {val}
                            </EditableText>
                        ) : val}
                        
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}

export default FAQsCategory