import React, { useRef } from "react";
import "./HorizontalScroll.css";
import Button from "./Button";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";

const HorizontalScroll = ({ children, scrollAmount = 300 }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="scroll-wrapper">
      <Button className="scroll-btn left" onClick={scrollLeft}>
        <ArrowLeftIcon 
          color="#000000"
        />
      </Button>

      <div className="scroll-container" ref={scrollRef}>
        {children}
      </div>

      <Button className="scroll-btn right" onClick={scrollRight}>
        <ArrowRightIcon 
          color="#000000"
        />
      </Button>
    </div>
  );
};

export default HorizontalScroll;
