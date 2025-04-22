// src/components/ScrollToTop.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';
import { assets } from "../assets/frontend_assets/assets";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust timing if needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-100">
          {/* <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div> */}
          <StyledWrapper>
      <div className="loader">
      <img className="left-wing" src={assets.mnarbirdleft} alt="" />
        <svg viewBox="0 0 2.4 14.4" version="1.1" y={0} x={0} height={150} width={25} xmlns="http://www.w3.org/2000/svg">
          <path d="M2.2 13c0 .641-.447 1.16-1 1.16-.553 0-1-.519-1-1.16V1.4C.2.759.647.24 1.2.24c.553 0 1 .519 1 1.16z" fill="#000" />
        </svg>
       <img className="right-wing" src={assets.mnarbirdright} alt="" />
      </div>
    </StyledWrapper>
        </div>
      )}
    </>
  );
};
const StyledWrapper = styled.div`
  /* Butterfly loader created by WerlynDev in Uiverse.io*/
.left-wing {
  animation: flapLeft 0.5s ease-in-out infinite;
  transform-origin: center right;
  position: relative;
  left: 2%;
}

.right-wing {
  animation: flapRight 0.5s ease-in-out infinite;
  transform-origin: center left;
  position: relative;
  left: -2%;
}

@keyframes flapLeft {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(60deg);
  }
}

@keyframes flapRight {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-60deg);
  }
}

  .loader {
    --sizeLoader: 60px;
    --sizeLoaderHalf: calc(var(--sizeLoader) / 2);
    --stepBtf: calc(var(--sizeLoader) / 10);
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: var(--sizeLoader);
    height: var(--sizeLoader);
  }

  .loader:hover {
    cursor: progress;
  }

  .loader[anim1] {
    animation: anim1 0.3s alternate ease-in-out infinite;
  }

  .loader:not([anim1]) {
    right: var(--sizeLoaderHalf);
    transform-origin: center right;
    animation: moveAround 2s linear infinite;
  }

  .loader[showShadow] {
    filter: drop-shadow(0 10px 10px #060606de);
  }

  .loader svg:nth-child(1) {
    position: relative;
    height: 100%;
    left: 2%;
    transform-origin: center right;
    animation: wing 0.5s ease-in-out infinite;
  }

  .loader svg:nth-child(2) {
    height: 50%;
  }

  .loader svg:nth-child(3) {
    position: relative;
    height: 100%;
    left: -2%;
    transform-origin: center left;
    animation: wing 0.5s ease-in-out infinite;
  }

  @keyframes wing {
    0% {
      transform: rotateY(0deg);
    }

    50% {
      transform: rotateY(60deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes moveAround {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes anim1 {
    from {
      transform: translateY(0px);
    }

    to {
      transform: translateY(var(--stepBtf));
    }
  }

  /* @media (prefers-color-scheme: dark) {
    .loader[showShadow]{
      filter: drop-shadow(0 10px 10px #dbdbdbde);
    }
  } */`;
export default ScrollToTop;
