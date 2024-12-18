import React from "react";
import { CCarouselItem, CCarousel, CImage } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const Carousel = () => (
  <div className="mx-auto mt-4 px-4 md:px-0">
    {" "}
    {/* Add padding for smaller screens */}
    <CCarousel controls interval={2000}>
      <CCarouselItem>
        <CImage
          className="block w-full object-cover rounded-lg"
          style={{ maxHeight: "400px" }} // Optional: Limit max height
          src={"/img/carousel/c2.webp"}
          alt="slide 1"
        />
      </CCarouselItem>
      <CCarouselItem>
        <CImage
          className="block w-full object-cover rounded-lg"
          style={{ maxHeight: "400px" }}
          src={"/img/carousel/c3.webp"}
          alt="slide 2"
        />
      </CCarouselItem>
      <CCarouselItem>
        <CImage
          className="block w-full object-cover rounded-lg"
          style={{ maxHeight: "400px" }}
          src={"/img/carousel/c4.webp"}
          alt="slide 3"
        />
      </CCarouselItem>
    </CCarousel>
  </div>
);

export default Carousel;
