import React from 'react';

const ToggleSort = ({ icon, label, on, onToggle }) => {
  return (
    <div
      className={on ? 'active' : ''}
      onClick={onToggle}
      onKeydown={onToggle}
      role="button"
      tabindex="-1"
    >
      {label}
      {on && icon}
    </div>
  );
};

export default ToggleSort;
