import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.PureComponent {
  render() {
    const {
      open,
      title,
      contentText,
      okText,
      cancelText,
      handleClose,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={() => handleClose && handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose && handleClose(false)} color="primary" autoFocus>
            {cancelText}
          </Button>

          <Button onClick={() => handleClose && handleClose(true)} color="primary">
            {okText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  contentText: PropTypes.string,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  handleClose: PropTypes.func,
};

export default AlertDialog;
