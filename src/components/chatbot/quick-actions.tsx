'use client';

import { Button } from '@/components/ui/button';
import { 
  Video, 
  Key, 
  HelpCircle, 
  BookOpen 
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface QuickActionsProps {
  onSelect: (action: string) => void;
}

const quickActions = [
  {
    icon: Video,
    label: 'View Webinars',
    message: 'Show me upcoming webinars',
  },
  {
    icon: Key,
    label: 'Help with Login',
    message: 'I need help logging in',
  },
  {
    icon: HelpCircle,
    label: 'Contact Support',
    message: 'I want to contact support',
  },
  {
    icon: BookOpen,
    label: 'How It Works',
    message: 'How does MedUni work?',
  },
];

export function QuickActions({ onSelect }: QuickActionsProps): React.ReactElement {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-600 mb-3 font-medium">Quick Actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelect(action.message)}
              className={cn(
                'justify-start text-left h-auto py-2 px-3',
                'border-gray-200 hover:border-green-600 hover:bg-green-50',
                'text-gray-700 hover:text-green-700'
              )}
            >
              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

