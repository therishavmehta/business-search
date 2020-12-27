import React from "react";
import './styles.css';
import CloseIcon from '@material-ui/icons/Close';

const Modal = ({ handleClose, show=false, children }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
        {children}
        <CloseIcon className="modal-close" onClick={handleClose}/>
      </div>
    </div>
  );
};

export default Modal;
