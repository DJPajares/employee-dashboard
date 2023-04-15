import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';

export type CustomDialogProps = {
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
  actions: any;
};

const CustomDialog = ({
  title,
  content,
  open,
  onClose,
  actions
}: CustomDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">{content}</Typography>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
