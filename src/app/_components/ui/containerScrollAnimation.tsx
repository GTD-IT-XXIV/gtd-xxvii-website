"use client";
import React, {useRef} from "react";
import {useScroll, useTransform, motion, MotionValue} from "framer-motion";

export const ContainerScroll = ({children}: {children: React.ReactNode}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const rotate = useTransform(scrollYProgress, [0.35, 0.75], [20, 0]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[80vh] md:h-[105vh] flex items-center justify-center relative pt-5 md:pt-0 px-4 md:px-7"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-10 w-full relative"
        style={{
          perspective: "700px",
        }}
      >
        {/* <Header translate={translate} titleComponent={titleComponent} /> */}
        <Card rotate={rotate} translate={translate}>
          {children}
        </Card>
      </div>
    </div>
  );
};

// export const Header = ({translate, titleComponent}: any) => {
//   return (
//     <motion.div
//       style={{
//         translateY: translate,
//       }}
//       className="div max-w-5xl mx-auto text-center"
//     >
//       {titleComponent}
//     </motion.div>
//   );
// };

export const Card = ({
  rotate,
  children,
}: {
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
      }}
      className="max-w-6xl -mt-12 mx-auto h-[70vh] md:h-[85vh] w-full p-2 md:p-3 bg-[#222222] rounded-[22px] md:rounded-[25px] shadow-2xl overflow-hidden"
    >
      <div className=" h-full w-full  overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl ">
        {children}
      </div>
    </motion.div>
  );
};
