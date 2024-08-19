import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import myclass from '../../../assets/signup/myclass.jpg'
import mygraph from '../../../assets/signup/mygraph.jpg'
import myschedule from '../../../assets/signup/myschedule.jpg'
import myteachers from '../../../assets/signup/myteachers.jpg'
import myvideo from '../../../assets/signup/myvideo.jpg'
import steach from '../../../assets/signup/steachgif.gif'

// 이진송
// 회원가입에 있지만, 초초초메인페이지로 보낼 예정
const IntroductionSignUp: React.FC = () => {
  const navigate = useNavigate()
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true)
  }, []);

    return (
    <div>
        <img
          src={steach}
          className={`mx-auto p-10 transition-opacity duration-500 ease-out ${animate ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className='text-3xl p-5 text-center whitespace-nowrap'>
          <p>스티치와 함께라면 최고의 원격 과외 경험을 통해 학습 목표를 달성할 수 있습니다.</p>
          <p>지금 바로 스티치에 가입하고 다양한 혜택을 누려보세요!</p>
          <div className='flex my-10 items-center justify-center'>
          <button
            onClick={() => { navigate('/user/signup') }}
            className='py-5 px-4 my-auto mx-5 text-3xl bg-pink-400 hover:bg-pink-600 text-white rounded-2xl whitespace-nowrap'
            >스티치와 함께하기</button>
          <button
            onClick={() => { navigate('/user/login') }}
            className='py-5 px-4 my-auto mx-5 text-3xl bg-pink-400 hover:bg-pink-600 text-white rounded-2xl whitespace-nowrap'
            >로그인 하러가기</button>
            </div>
        </div>
    </div>
    )
}

export default IntroductionSignUp;
