
import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="flex items-center bg-cyan-500/20 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-2 text-cyan-200 hover:text-white">
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
        placeholder="Type a skill and press Enter..."
      />
    </div>
  );
};

export default TagInput;
