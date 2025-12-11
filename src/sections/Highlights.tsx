"use client";
import { useEffect, useRef, useState } from "react";

export default function Highlights() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;

    const autoScroll = () => {
      if (!container) return;
      scrollAmount += 1.1;
      container.scrollLeft = scrollAmount;

      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(autoScroll, 25);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const images = [
    // { src: "/Highlights/images/img0.jpg", type: "vertical" },
    { src: "/Highlights/images/img1.jpg", type: "vertical" },

    { src: "/Highlights/images/img2.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img3.jpg", type: "horizontal-bottom" },

    // { src: "/Highlights/images/img6.jpg", type: "vertical" },
    { src: "/Highlights/images/img7.jpg", type: "vertical" },

    { src: "/Highlights/images/img4.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img5.jpg", type: "horizontal-bottom" },
    { src: "/Highlights/images/img27.jpg", type: "vertical" },
    // { src: "/Highlights/images/img22.jpg", type: "vertical" },
    
    { src: "/Highlights/images/img8.jpg", type: "horizontal-bottom" },

    // { src: "/Highlights/images/img9.jpg", type: "vertical" },

    { src: "/Highlights/images/img10.jpg", type: "vertical" },
    { src: "/Highlights/images/img11.jpg", type: "horizontal-bottom" },
    { src: "/Highlights/images/img18.jpg", type: "vertical" },
    { src: "/Highlights/images/img16.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img17.jpg", type: "horizontal-bottom" },

    { src: "/Highlights/images/img12.jpg", type: "vertical" },

    { src: "/Highlights/images/img13.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img14.jpg", type: "horizontal-bottom" },

    { src: "/Highlights/images/img15.jpg", type: "vertical" },

    { src: "/Highlights/images/img19.jpg", type: "vertical" },
    { src: "/Highlights/images/img20.jpg", type: "vertical" },
    { src: "/Highlights/images/img21.jpg", type: "vertical" },
    
    { src: "/Highlights/images/img23.jpg", type: "vertical" },
    { src: "/Highlights/images/img24.jpg", type: "vertical" },
  
    { src: "/Highlights/images/img25.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img26.jpg", type: "horizontal-bottom" },
  
    // { src: "/Highlights/images/img23.jpg", type: "vertical" },
    { src: "/Highlights/images/img28.jpg", type: "vertical" },
  
    { src: "/Highlights/images/img29.jpg", type: "horizontal-top" },
    { src: "/Highlights/images/img30.jpg", type: "horizontal-bottom" },
  
    { src: "/Highlights/images/img31.jpg", type: "vertical" },
  ];

  const renderImage = (img: any, idx: number) => {
    if (img.type === "vertical") {
      return (
        <img
          key={idx}
          src={img.src}
          alt={`vertical-${idx}`}
          className="h-60 sm:h-72 md:h-80 lg:h-[28rem] w-auto object-cover rounded-3xl 
          transition-transform duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
        />
      );
    }
  };

  const groupedImages: any[] = [];
  for (let i = 0; i < images.length; i++) {
    if (images[i].type === "vertical") {
      groupedImages.push(renderImage(images[i], i));
    } else if (images[i].type === "horizontal-top") {
      const top = images[i];
      const bottom = images[i + 1];
      groupedImages.push(
        <div
          key={`pair-${i}`}
          className="flex flex-col justify-between 
          h-60 sm:h-72 md:h-80 lg:h-[28rem] 
          gap-2 sm:gap-3 md:gap-4 
          w-40 sm:w-48 md:w-56 lg:w-64 
          flex-shrink-0"
        >
          <img
            src={top.src}
            alt={`horizontal-top-${i}`}
            className="h-1/2 w-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
          <img
            src={bottom.src}
            alt={`horizontal-bottom-${i}`}
            className="h-1/2 w-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </div>
      );
      i++;
    }
  }

  return (
    <section id="highlights" className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center scroll-mt-24">
      <div className="px-4 pt-24 w-full">
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Highlights
          </h2>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none items-end whitespace-nowrap"
            style={{ scrollbarWidth: "none" }}
          >
            {groupedImages}
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 mt-10">
        <p className="text-neutral-300 text-center max-w-3xl mx-auto text-lg">
          A glimpse into my journey — moments that shaped me ✨
        </p>
      </div>
    </section>
  );
}
