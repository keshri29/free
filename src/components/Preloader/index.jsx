"use client";
import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { opacity, slideUp, fadeIn } from "./anim";
import Image from "next/image";

 
export default function Index({ setIsLoading }) {
   const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const videoRef = useRef(null);

  const handleButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };
 

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const initialValue = "Get Started";
  const [text, setText] = useState(initialValue);

  const handleMouseOver = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText((prevText) => {
        return prevText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return initialValue[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");
      });

      if (iteration >= initialValue.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.div variants={slideUp} initial="initial" exit="exit" className={styles.introduction}>
      {dimension.width > 0 && (
        <>
          <motion.div variants={fadeIn} initial="initial" animate="enter" className={styles.start}>
            <Image className={styles.img} src="/logo.gif" alt="preloaderLogo" width={70} height={70} />
            <button onClick={handleButtonClick} className={styles.button} onMouseOver={handleMouseOver}>
              {text}
            </button>
          </motion.div>
          <svg>
            <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
