import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';

const AutocompleteInput = ({ 
  suggestions = [], 
  placeholder = "Nhập địa điểm...", 
  value = "", 
  onChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions(suggestions);
      setIsOpen(false);
    }
    setActiveSuggestion(-1);
  }, [value, suggestions]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setIsOpen(false);
    setActiveSuggestion(-1);
    // Focus lại input sau khi chọn
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  const handleInputFocus = () => {
    if (value.length === 0) {
      setFilteredSuggestions(suggestions);
      setIsOpen(true);
    } else {
      // Nếu có value, hiển thị filtered suggestions
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    }
  };

  const handleInputBlur = () => {
    // Tăng delay để đảm bảo click event được xử lý trước
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className={`w-full ${className}`}
        autoComplete="off"
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              ref={el => suggestionRefs.current[index] = el}
              className={`px-4 py-2 cursor-pointer text-[var(--color-dark)] hover:bg-[var(--color-lightgray)] transition-colors duration-200 ${
                index === activeSuggestion ? 'bg-[var(--color-lightgray)]' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}`}
              onMouseDown={(e) => {
                // Prevent blur event from firing before click
                e.preventDefault();
              }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
