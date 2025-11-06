"use client"

import React, { useState, ChangeEvent, KeyboardEvent, JSX } from 'react';

interface EditableTextProps {
  tag?: keyof JSX.IntrinsicElements;
  children: string;
  className?: string;
  type?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  tag: Tag = 'p',
  children,
  className = '',
  type = 'input'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children);
  const [tempText, setTempText] = useState(children);

  const handleDoubleClick = () => {
    setTempText(text);
    setIsEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  const handleBlur = () => {
    setText(tempText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      setText(tempText);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    type === "input" ? (
      <input
        className={`border p-1 ${className}`}
        autoFocus
        value={tempText}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    ) : (
      <textarea
        className={`border p-1 resize-none ${className}`}
        autoFocus
        value={tempText}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    )
  ) : (
    <Tag className={className} onDoubleClick={handleDoubleClick}>
      {text}
    </Tag>
  );
};

export default EditableText;
