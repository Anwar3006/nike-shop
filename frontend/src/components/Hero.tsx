"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { heros } from "@/types/heroUrls";

const images = [
  "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/76b53e201177537.667007b77c74f.jpg",
  "https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/6c0ad1225973523.6826287f8cb5a.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Slideshow */}
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Hero background image"
          fill
          className={`absolute inset-0 transition-opacity duration-1000 object-cover 
          ${index === currentImage ? "opacity-100" : "opacity-0"}
            `}
          priority={index === 0}
        />
      ))}

      <div className="absolute inset-0 bg-black/45" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full text-white container mx-auto px-3">
        <h1 className="text-5xl font-bold font-bevellier md:text-heading-1 tracking-wide">
          Style That Moves
          <br />
          With You.
        </h1>
        <p className="mt-4 text-lg max-w-lg font-bevellier">
          Not just style. Not just comfort. Footwear that effortlessly moves
          with your every step.
        </p>
        <Button className="mt-8 bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-bevellier shadow-xs shadow-gray-400/50">
          Find Your Shoe
        </Button>
      </div>
    </section>
  );
};

export default Hero;
