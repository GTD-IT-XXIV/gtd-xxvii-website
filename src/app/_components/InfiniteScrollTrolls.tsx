import React, {useEffect, useState, useRef} from "react";
import {motion, useAnimationControls} from "framer-motion";
import Image from "next/image";

type ImageType = {
  src: string;
};

const InfiniteScrollTrolls = ({images}: {images: ImageType[]}) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth / 2;
        setWidth(scrollWidth);

        controls.set({x: 0});
        controls.start({
          x: -scrollWidth,
          transition: {
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          },
        });
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [controls, images]);

  return (
    <div className="overflow-hidden w-full mt-3 mb-7">
      <motion.div ref={containerRef} className="flex items-center w-max" animate={controls}>
        {[...images, ...images].map((img, index) => (
          <Image
            key={index}
            src={img.src}
            alt={`scroll-image-${index}`}
            width={100}
            height={100}
            className="mx-7 md:mx-12"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScrollTrolls;
