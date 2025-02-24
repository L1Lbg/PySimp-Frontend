import { Button } from '@/components/ui/button';
import { Lock, Unlock, Trash2, Download, Copy, MessageSquarePlus, Heart, HeartOff, Save, ScanEye, Eye } from 'lucide-react';
import { Widget, PopupButton } from '@typeform/embed-react'

interface EditorButtonsProps {
  canEdit: boolean;
  id: string;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  setDeleteDialogOpen: (value: boolean) => void;
  isVerified: boolean;
  setShowDownloadWarning: (value: boolean) => void;
  unsavedChanges: boolean;
  handleSave: (download?: boolean) => Promise<void>;
  handleDownload: () => void;
  handleFork: () => void;
  forking: boolean;
  setFeedbackOpen: (value: boolean) => void;
  liked: boolean;
  liking: boolean;
  handleLike: (value: boolean) => void;
  saving: boolean;
}

export function EditorButtons({
  canEdit,
  id,
  isPublic,
  setIsPublic,
  setDeleteDialogOpen,
  isVerified,
  setShowDownloadWarning,
  unsavedChanges,
  handleSave,
  handleDownload,
  handleFork,
  forking,
  setFeedbackOpen,
  liked,
  liking,
  handleLike,
  saving,
  projectTitle,
  setProjectTitle,
  approvalRequested,
  setApprovalRequested,
  approved
}: EditorButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-5 mt-5">
      {canEdit && id != '0' && (
        <>
          <input 
            type="text" value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPublic(!isPublic)}
            className={isPublic ? 'text-green-400' : 'text-yellow-400'}
          >
            {isPublic ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Private
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setApprovalRequested(!approvalRequested)}
            className={
              approved ? 'text-green-400' : approvalRequested ? 'text-green-400' : 'text-yellow-400'
            }
          >
            {
              approved ? (
                <>
                  <ScanEye className="h-4 w-4 mr-2" />
                  Approved!
                </>
              ) : approvalRequested ? (
                <>
                  <ScanEye className="h-4 w-4 mr-2" />
                  Approval Requested
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Request approval
                </>
              )
            }
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </>
      )}
      {id != '0' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if(!isVerified) {
                setShowDownloadWarning(true);
              } else {
                if(unsavedChanges) {
                  handleSave(true);
                } else {
                  handleDownload();
                }
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleFork}
            disabled={forking}
          >
            <Copy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Send Feedback</span>
          </Button> 
        </>
      )}
      {!canEdit && id != '0' && (
        <>
          {liked ? (
            <Button
              disabled={liking}
              variant="outline"
              size="sm"
              onClick={() => handleLike(false)}
            >
              <HeartOff className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Remove from liked</span>
            </Button>
          ) : (
            <Button
              disabled={liking}
              variant="outline"
              size="sm"
              onClick={() => handleLike(true)}
            >
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Like</span>
            </Button>
          )}
        </>
      )}
      {canEdit && (
        <Button size='sm' disabled={saving} onClick={() => handleSave(false)}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      )}
      {unsavedChanges && (
        <span className='text-slate-500'>* Unsaved changes</span>
      )}
    </div>
  );
}