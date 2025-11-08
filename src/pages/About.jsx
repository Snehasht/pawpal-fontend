import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.banner2} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to PawPal, your trusted online destination for connecting
            loving homes with wonderful pets. We founded PawPal on a simple
            belief: every animal deserves a second chance, a warm lap, and a
            forever family. We understand that adopting a pet is a deeply
            personal and meaningful decision, and our platform is designed to
            make that journey as joyful, transparent, and seamless as possible.
            We work closely with shelters and rescue organizations to showcase
            dogs and cats who are ready to take the next step into a happy,
            stable life.
          </p>
          <p>
            PawPal is more than just a listing site; it's a community built on
            compassion. Whether you are ready to adopt, looking to volunteer
            with a local rescue, or just love scrolling through adorable pet
            photos, you are an essential part of our mission. Every adoption
            story written through PawPal helps us move closer to realizing our
            vision. Take a moment to explore the profiles of the amazing animals
            waiting right now—your new best friend might just be a click away!
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision is a world where no adoptable pet is left without a home.
            We strive to be the most comprehensive and user-friendly pet
            adoption platform, setting a new standard for ethical and efficient
            pet rehoming. We aim to leverage technology to reduce the time
            animals spend in shelters, increase adoption rates, and foster a
            global community dedicated to animal welfare and responsible pet
            ownership. Ultimately, we envision a future where shelters can focus
            solely on rescue and care, knowing that a network like PawPal is
            actively finding perfect matches for every animal.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#60A5FA] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ">
          <b>Ethical & Vetted Partners</b>
          <p>We only feature pets from vetted shelters and approved rescue organizations, guaranteeing responsible sourcing and the best care standards.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#60A5FA] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ">
          <b>Streamlined Matching</b>
          <p>Our platform provides accurate, powerful search tools and detailed pet profiles to help you quickly find a perfect companion that fits your lifestyle.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#60A5FA] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ">
          <b>Dedicated Support</b>
          <p>We offer transparent information and resources throughout the entire process, supporting you from your first click to the final adoption day.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
