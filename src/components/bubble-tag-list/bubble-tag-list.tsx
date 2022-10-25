import React from 'react';
import { getFormattedDate } from '@/helpers/time';
import './bubble-tag-list.scss';

interface BubbleTagListProps {
  className?: string;
  variant: 'purple' | 'blue' | 'green';
  tags: string[];
}

export const BubbleTagList = ({ className = '', variant, tags }: BubbleTagListProps) => {
  const bubbleTags = tags.map(getBubbleTag);
  return <div className={`c-bubble-tags ${className}`}>{bubbleTags}</div>;

  function getBubbleTag(tag: string) {
    const variantClass = `c-bubble-tag-${variant}`;
    return (
      <div key={tag} className={`c-bubble-tag ${variantClass}`}>
        {tag}
      </div>
    );
  }
};
