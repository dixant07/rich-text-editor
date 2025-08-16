import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

const COMMON_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
  '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶'
];

export default function EmojiPicker({ onEmojiSelect }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setShowPicker(!showPicker)}
        className="h-8 w-8 p-0"
      >
        <Smile className="h-4 w-4" />
      </Button>
      
      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute top-full right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
          style={{ zIndex: 1000, width: '280px' }}
        >
          <div className="text-sm font-medium mb-2 text-gray-700">
            Choose an emoji
          </div>
          <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
            {COMMON_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-6 h-6 text-lg hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

