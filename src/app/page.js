"use client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../components/Preloader";
import Landing from "../components/Landing";
import LandingMasked from "../components/LandingMasked";
import About from "../components/About";
import AboutMasked from "../components/AboutMasked";
import Work from "../components/Work";
import WorkMasked from "../components/WorkMasked";
import Connect from "../components/Connect";
import ConnectMasked from "../components/ConnectMasked";
import { Raleway } from "@next/font/google";
import useMousePosition from "../utils/useMousePosition";
import { motion } from "framer-motion";

const raleway = Raleway({
  subsets: ["latin"],
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      !isLoading && window.scrollTo(0, 0);

      // setTimeout( () => {
      //   setIsLoading(false);
      //   document.body.style.cursor = 'default'
      //   window.scrollTo(0,0);
      // }, 3000)
    })();
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const { x, y } = useMousePosition();

  const size = isHovered ? 400 : 30;

  return (
    <main className={`${styles.main} ${raleway.className}`}>
      <AnimatePresence mode="wait">{isLoading && <Preloader setIsLoading={setIsLoading} />}</AnimatePresence>
      {!isLoading && (
        <>
          <div className={styles.container}>
            <div>
              <Landing />
              <About setIsHovered={setIsHovered} />
              <Work />
              <Connect />
            </div>
            <motion.div
              className="mask"
              animate={{
                WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
                WebkitMaskSize: `${size}px`,
              }}
              transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
            >
              <LandingMasked setIsHovered={setIsHovered} />
              <AboutMasked setIsHovered={setIsHovered} />
              <WorkMasked setIsHovered={setIsHovered} />
              <ConnectMasked setIsHovered={setIsHovered} />
            </motion.div>
          </div>
        </>
      )}
    </main>
  );
}
