import HotLectures from "../../components/main/HotLectures.tsx";
import HomePageCarousel from "../../components/main/Carousel.tsx";
import Subjects from "../../components/main/Subjects.tsx";
import LatestLectures from "../../components/main/LatestLectures.tsx";

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-12 bg-white ">
      <div className="col-span-12">
        <HomePageCarousel />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-10">
        <Subjects />
        <HotLectures />
        <LatestLectures />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default HomePage;
