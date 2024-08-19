import TempoarySpinner from "../../../assets/TemporarySpinner.gif";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <img src={TempoarySpinner} alt="no-image" />
    </div>
  );
};

export default Spinner;
