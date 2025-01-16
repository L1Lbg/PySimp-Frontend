import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/toast-provider';
import { Textarea } from '@/components/ui/textarea';


interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const { showError } = useToast();

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    
    setSendingFeedback(true);
    try {
      const response = await fetch(`${localStorage.getItem('api_url')}/api/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: feedback })
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setFeedback('');
      onOpenChange(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to send feedback');
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts about this project.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 2048))}
          placeholder="Write your feedback here..."
          className="min-h-[100px]"
        />
        <div className="text-right text-sm text-purple-200/60">
          {feedback.length}/2048 characters
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={sendingFeedback || !feedback.trim()}
            onClick={handleFeedbackSubmit}
          >
            {sendingFeedback ? 'Sending...' : 'Send Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}