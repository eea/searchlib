import React from 'react';

const ToggleSort = ({ icon, label, on, onToggle, children }) => {
  return (
    <div className="toggleSort">
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
      {children}
    </div>
  );
};

export default ToggleSort;
