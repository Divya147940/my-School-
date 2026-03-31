import React from 'react';
import './SkeletonLoader.css';

const Skeleton = ({ width, height, borderRadius, marginBottom, className = '' }) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: borderRadius || '8px',
    marginBottom: marginBottom || '0px'
  };

  return <div className={`skeleton-loader ${className}`} style={style}></div>;
};

export default Skeleton;
