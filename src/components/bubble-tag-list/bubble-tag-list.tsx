import React, { CSSProperties } from 'react';
import './bubble-tag-list.scss';

export interface BubbleTag {
  value: string;
  key?: string;
  style?: CSSProperties;
}

interface BubbleTagListProps {
  className?: string;
  variant?: 'purple' | 'blue' | 'green';
  bubbleTags: BubbleTag[];
}

export const BubbleTagList = ({
  className = '',
  variant = 'blue',
  bubbleTags,
}: BubbleTagListProps) => {
  const tags = bubbleTags.map(getTag);
  return <div className={`c-bubble-tags ${className}`}>{tags}</div>;

  function getTag(bubbleTag: BubbleTag) {
    const variantClass = `c-bubble-tag-${variant}`;
    const bubbleTagKey = bubbleTag.key ?? bubbleTag.value;
    return (
      <div key={bubbleTagKey} className={`c-bubble-tag ${variantClass}`} style={bubbleTag.style}>
        {bubbleTag.value}
      </div>
    );
  }
};
