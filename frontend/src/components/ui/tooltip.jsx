import React from 'react';

import { useTooltip } from './TooltipProvider';

const Tooltip = ({ children, content, id }) => {
  const { addTooltip, removeTooltip } = useTooltip();

  React.useEffect(() => {
    addTooltip({ id, content });
    return () => removeTooltip(id);
  }, [addTooltip, removeTooltip, id, content]);

  return (
    <div className="tooltip">
      {children}
      <span className="tooltip-content">{content}</span>
    </div>
  );
};

export default Tooltip;
