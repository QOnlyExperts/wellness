import React, { useRef, useState, useEffect } from "react";
import "./HorizontalScroll.css";
import Button from "./Button";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";

const HorizontalScroll = ({ children, scrollAmount = 300 }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    // Solo mostramos botones si hay overflow
    const isOverflowing = scrollWidth > clientWidth;
    setShowRight(isOverflowing && scrollLeft + clientWidth < scrollWidth - 10);
    setShowLeft(isOverflowing && scrollLeft > 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="scroll-wrapper">
      {showLeft && (
        <Button className="scroll-btn left" onClick={scrollLeft}>
          <ArrowLeftIcon color="#000000" />
        </Button>
      )}

      <div className="scroll-container" ref={scrollRef}>
        {children}
      </div>

      {showRight && (
        <Button className="scroll-btn right" onClick={scrollRight}>
          <ArrowRightIcon color="#000000" />
        </Button>
      )}
    </div>
  );
};

export default HorizontalScroll;
