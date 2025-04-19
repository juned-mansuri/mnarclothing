const ShinyText = ({ text, speed = 2, className = '' }) => {
    return (
      <div
        className={`
          text-transparent
          font-extrabold 
          bg-clip-text 
          animate-shine 
          bg-[linear-gradient(90deg,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0.6)_50%,_rgba(255,255,255,0.1)_100%)] 
          bg-[length:200%_100%]
          ${className}
        `}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {text}
      </div>
    );
  };
  
  export default ShinyText;
  