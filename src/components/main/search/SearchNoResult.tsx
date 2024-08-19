const SearchNoResult: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-5">
      <div>
        <div>
          <img
            src="https://steach.ssafy.io/img-upload/display/my/akjccuxzqsimage-removebg-preview (3).png"
            alt="no-image"
          />
        </div>
        <div className="text-center">
          <p className="text-2xl">축하해요!</p>
          <p className="text-3xl">행복을 가져다 주는 황금 코알라를 찾았어요!</p>
        </div>
      </div>
    </div>
  );
};

export default SearchNoResult;
