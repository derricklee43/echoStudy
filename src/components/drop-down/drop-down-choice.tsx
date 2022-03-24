import React from 'react';
interface DropDownChoiceProps {
  variant?: 'dark' | 'light';
  className?: string;
  bubbleOnClickEvent?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const DropDownChoice = ({
  className,
  variant = 'dark',
  bubbleOnClickEvent = true,
  onClick,
}: DropDownChoiceProps) => {
  return <div>hello world</div>;
};
