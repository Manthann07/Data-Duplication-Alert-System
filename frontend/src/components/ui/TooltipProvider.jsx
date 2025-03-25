import React, { createContext, useContext, useState } from 'react';

const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [tooltips, setTooltips] = useState([]);

  const addTooltip = (tooltip) => {
    setTooltips((prev) => [...prev, tooltip]);
  };

  const removeTooltip = (id) => {
    setTooltips((prev) => prev.filter((tooltip) => tooltip.id !== id));
  };

  return (
    <TooltipContext.Provider value={{ tooltips, addTooltip, removeTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  return useContext(TooltipContext);
};
