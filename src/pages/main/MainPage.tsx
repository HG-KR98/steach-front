import IntroductionSignUp from "../../components/user/SignUp/IntroductionSignUp";

const MainPage: React.FC = () => {
  return (
    <div className="grid grid-cols-12 bg-white">
      <div className="col-span-3"></div>
      <div className="col-span-6">
        <IntroductionSignUp />
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default MainPage;
