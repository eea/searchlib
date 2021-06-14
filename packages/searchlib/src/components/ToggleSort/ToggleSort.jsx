import React from 'react';

const ToggleSort = ({ icon, label, on, onToggle }) => {
  return (
    <div
      className={on ? 'active' : ''}
      onClick={onToggle}
      onKeyDown={onToggle}
      role="button"
      tabIndex="-1"
    >
      {label}
      {on && icon}
    </div>
  );
};

export default ToggleSort;
