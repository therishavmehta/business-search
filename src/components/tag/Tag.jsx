import {React} from 'react';
import './styles.css';

function Tag({children, clickTrigger, active=[]}) {
  return (
    <span id={children} className={active.includes(children) ? "tag-select" : "tag"} style={clickTrigger && {cursor: 'pointer'}}>
      {children}
    </span>
  );
}

export default Tag;
