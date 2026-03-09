'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatbotWindow } from './chatbot-window';

export function ChatbotWidget(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80">
          <ChatbotWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}

