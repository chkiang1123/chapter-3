import { useMemo } from 'react';
import { renderMathToHtml } from '../engine/mathEngine';

interface MathExprProps {
  expr: string;
  highlight?: boolean;
  className?: string;
}

export function MathExpr({ expr, highlight = false, className = '' }: MathExprProps) {
  const html = useMemo(() => renderMathToHtml(expr, highlight), [expr, highlight]);
  return (
    <span
      className={`font-math ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
