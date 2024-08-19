import noCurriculaImage from "../../../assets/noCurrirula.png";

const TeacherNothingCurricula: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <img src={noCurriculaImage} alt="no-image" className="w-2/3 h-[750px]" />
    </div>
  );
};

export default TeacherNothingCurricula;
