import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const partners = [
  {
    name: "Bangladesh Red Crescent",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bangladesh_Red_Crescent_Society_Flag.svg/2560px-Bangladesh_Red_Crescent_Society_Flag.svg.png",
  },
  {
    name: "Apollo Hospital",
    logo: "https://p7.hiclipart.com/preview/141/861/241/apollo-hospitals-apollo-hospital-indraprastha-apollo-hospital-dhaka-health-care-india.jpg",
  },
  { name: "United Hospital", logo: "https://seeklogo.com/vector-logo/438875/united-hospital" },
  {
    name: "Square Hospital",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa5Dfxx8yFX4nmM1xTtoayzYZenM1G3V6uqg&s",
  },
  {
    name: "Labaid",
    logo: "https://images.seeklogo.com/logo-png/37/1/labaid-logo-png_seeklogo-370215.png",
  },
  {
    name: "Popular Diagnostic",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5UX642O2hh1WmYVNa2eh2oF3HI4Wfmfqxw&s",
  },
  {
    name: "Evercare",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrfZ_8b621Uwhzu83FoWj5hx8OO9pWCnuHJQ&s",
  },
  {
    name: "Medinova",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf935XR8saU09eoPej6sJysCqTVAS6PYgmrw&s",
  },
];

const PartnerSwiper = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black/30 to-transparent" />

      <Swiper
        modules={[Autoplay]}
        loop
        speed={2600}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={3}
        spaceBetween={10}
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 12 },
          640: { slidesPerView: 5, spaceBetween: 14 },
          1024: { slidesPerView: 7, spaceBetween: 16 },
        }}
        className="py-7"
      >
        {partners.map((p, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex h-20 items-center justify-center rounded-xl bg-white/10 px-4">
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = `<span class="text-sm font-semibold text-white/90">${p.name}</span>`;
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PartnerSwiper;
