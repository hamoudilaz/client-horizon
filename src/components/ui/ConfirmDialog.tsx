import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { cleanWallet } from '../../services/api';

type CleanWalletResultProps = {
  cleaned: number;
  claimedSol: number;
  claimedUsd: number;
};

export default function CleanWalletDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanWalletResultProps | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [isHardCleanup, setIsHardCleanup] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => !loading && setOpen(false);
  const handleResultClose = () => setResultOpen(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const data = await cleanWallet(isHardCleanup);
      setResult(data);
    } catch {
      setResult({ cleaned: 0, claimedSol: 0, claimedUsd: 0 });
    } finally {
      setLoading(false);
      setOpen(false);
      setResultOpen(true);
    }
  };

  return (
    <>
      <button className='demo-button clean-wallet-btn' onClick={handleClickOpen}>
        🧹 Clean Wallet
      </button>

      {/* Confirm + Loading Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={loading}
        PaperProps={{
          sx: { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333' },
        }}
      >
        <DialogTitle sx={{ color: '#d1d1d1ff' }}>{loading ? 'Cleaning Wallet...' : 'Clean Wallet?'}</DialogTitle>
        <DialogContent>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress color='success' />
            </div>
          ) : (
            <>
              <DialogContentText sx={{ color: '#ccc' }}>
                This will remove dust token accounts and reclaim SOL rent.
              </DialogContentText>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
                <label htmlFor='hard-cleanup-switch' style={{ color: '#ccc', marginRight: 8 }}>
                  Hard Cleanup (close all accounts):
                </label>
                <input
                  id='hard-cleanup-switch'
                  type='checkbox'
                  checked={isHardCleanup}
                  onChange={(e) => setIsHardCleanup(e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </DialogContent>
        {!loading && (
          <DialogActions>
            <Button onClick={handleClose} color='inherit'>
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant='text' color='success' autoFocus>
              Confirm
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Result Dialog */}
      <Dialog
        open={resultOpen}
        onClose={handleResultClose}
        PaperProps={{
          sx: { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333' },
        }}
      >
        <DialogTitle sx={{ color: '#d1d1d1ff' }}>Cleanup Complete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ccc' }}>
            {result?.cleaned && result.cleaned > 0 ? (
              <>
                Closed {result.cleaned} accounts and claimed {result.claimedSol.toFixed(3)} SOL (
                <span style={{ color: '#4caf50', fontWeight: 600 }}>${result.claimedUsd}</span>
                ).
              </>
            ) : (
              'No eligible accounts found or SOL balance is 0.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResultClose} variant='text' color='success' autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
