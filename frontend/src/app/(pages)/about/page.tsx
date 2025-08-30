import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="bg-white text-black font-bevellier">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              At Nike, we are dedicated to inspiring the athlete in everyone. Our
              mission is to bring innovation and inspiration to every athlete* in
              the world. (*If you have a body, you are an athlete).
            </p>
            <div className="flex justify-center my-8">
              <Image
                src="/hero-shoe.png"
                alt="Nike Shoe"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </div>
            <p className="text-lg leading-relaxed">
              Founded in 1964 as Blue Ribbon Sports, we officially became Nike,
              Inc. in 1971. The company was founded by Bill Bowerman, a
              track-and-field coach at the University of Oregon, and his former
              student, Phil Knight. They launched the first Nike shoe with the
              iconic &quot;Swoosh&quot; logo in 1972.
            </p>
            <p className="text-lg leading-relaxed">
              Today, we are the world&apos;s largest supplier of athletic shoes and
              apparel and a major manufacturer of sports equipment. We are
              committed to creating a better, more sustainable future for our
              people, our planet, and our communities through the power of sport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
