import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { LecturesState, reportLectureSlice } from "../../store/LectureSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";


const GamePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(reportLectureSlice("6639"))
  },[dispatch])
  const lectures = useSelector((state: RootState) => (state.lectures.lectureReport));
  console.log(lectures)
  return (
    <div className="grid grid-cols-11 gap-4 h-screen items-center">
      <div className="col-span-1"></div>
      <div className="col-span-3">
        <Link to={"/game/cat"}>
          <img src="https://steach.ssafy.io/img-upload/display/my/hzlxtcxooigo.jpg" alt="" />  
        </Link>
      </div>
      <div className="col-span-3">
        <Link to={"/game/man"}>
          <img src="https://steach.ssafy.io/img-upload/display/my/kfhjuhnvplman.jpg" alt="" />  
        </Link>
      </div>
      <div className="col-span-3">
        <Link to={"/game/reva"}>
          <img src="https://steach.ssafy.io/img-upload/display/my/ifnnltrozgreva.jpg" alt="" />  
        </Link>
      </div>
      <div className="col-span-1"></div>
      </div>
  )
}
export default GamePage;
