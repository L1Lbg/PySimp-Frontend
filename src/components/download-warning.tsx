import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { AlertTriangle } from 'lucide-react';
  
  interface DownloadWarningProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export default function DownloadWarning({ isOpen, onClose, onConfirm }: DownloadWarningProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Unverified Project Warning
            </DialogTitle>
            <DialogDescription>
              This project has not been verified by our team. Downloading and running unverified projects may pose security risks. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Download Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }