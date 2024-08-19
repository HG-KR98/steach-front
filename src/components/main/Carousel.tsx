import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import teacher1 from "../../assets/cimg/hgteacher.png"
import teacher2 from "../../assets/cimg/hlteacher.png"
import teacher3 from "../../assets/cimg/hkteacher.png"
import teacher4 from "../../assets/cimg/jsteacher.png"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const imageUrls = [
  teacher1,
  teacher2,
  teacher3,
  teacher4,
];

const generateSlides = (urls: string[]) => {
  return urls.map((url, index) => (
    <SwiperSlide key={index}>
      <img src={url} alt={`slide-${index}`} style={imageStyle} />
    </SwiperSlide>
  ));
};

const HomePageCarousel: React.FC = () => {
  return (
    <>
      <style>{`
        .mySwiper {
          width: 100%;
          height: 30rem;
        }

        .carousel-image {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 100%;
          margin: 0 auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <Swiper
        loop={true}
        navigation={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        speed={1800}
      >
        {generateSlides(imageUrls)}
      </Swiper>
    </>
  );
};

const imageStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default HomePageCarousel;
