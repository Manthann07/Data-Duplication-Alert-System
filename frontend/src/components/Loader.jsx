import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    height: 100%;
  }

  .bar {
    width: 4px;
    height: 18px;
    background: #076fe5;
    border-radius: 2px;
    animation: loading 1s ease-in-out infinite;
  }

  .bar1 {
    animation-delay: 0s;
  }

  .bar2 {
    animation-delay: 0.2s;
  }

  .bar3 {
    animation-delay: 0.4s;
  }

  @keyframes loading {
    0% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(2);
    }
    100% {
      transform: scaleY(1);
    }
  }
`;

export default Loader;