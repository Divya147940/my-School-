import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array(count).fill(0);

  return (
    <div className={`skeleton-container ${type}-grid`}>
      {items.map((_, i) => (
        <div key={i} className={`skeleton-item ${type}`}>
          <div className="skeleton-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
