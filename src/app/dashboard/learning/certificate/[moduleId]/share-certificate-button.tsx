'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareCertificateButton({ shareUrl }: { shareUrl: string }): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="inline-flex items-center gap-2">
      {copied ? (
        <>
          <Check className="h-4 w-4" strokeWidth={1.5} />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" strokeWidth={1.5} />
          Copy share link
        </>
      )}
    </Button>
  );
}
