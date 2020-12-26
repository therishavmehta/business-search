import React from "react";
import './styles.css';

const Modal = ({ handleClose, show=false, children }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
        {children}
        <a className="modal-close" onClick={handleClose}>
          close
        </a>
      </div>
    </div>
  );
};

export default Modal;
