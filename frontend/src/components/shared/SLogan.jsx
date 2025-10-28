import React, { useEffect, useState } from "react";
import "./Slogan.css";

export default function Slogan() {
  const phrases = [
    "Activa tu ritmo, renueva tu energía",
    "Movimiento, música y mente en sintonía",
    "Recuerda, en bienestar siempre estaremos contigo",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 5500); // cambia cada 3.5s
    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <section className="slogan">
      <h1 key={index} className="fade">
        {phrases[index]}
      </h1>
    </section>
  );
}
