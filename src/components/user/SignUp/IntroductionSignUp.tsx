import myclass from '../../../assets/signup/myclass.jpg'
import mygraph from '../../../assets/signup/mygraph.jpg'
import myschedule from '../../../assets/signup/myschedule.jpg'
import myteachers from '../../../assets/signup/myteachers.jpg'
import myvideo from '../../../assets/signup/myvideo.jpg'

const IntroductionSignUp: React.FC = () => {
    return (
    <div className='w-3/5'>
      <h2 className='text-7xl text-center'>스티치</h2>
        <p className='text-center'>
        <span className='text-5xl'>우리 스티치와 함께 한다면 <span className='bg-yellow-200 inline-block px-1'>다음과 같은 혜택을 무료로 </span> 누릴 수 있습니다</span></p>

        <span className='text-5xl'>맞춤형 학습 경험</span>
        <div className='flex'>
          <div>
            <img src={myclass} alt="" className='w-96 h-80' />
          </div>
          <div className='flex items-center justify-center p-5'>
            학생 개개인의 학습 스타일과 필요에 맞춘 맞춤형 과외 서비스를 제공합니다.
            선생님들은 학생의 수준과 목표에 맞추어 학습 계획을 세워줍니다.
            </div>
        </div>
        <hr/>
        <div className='flex'>
          <div className='flex items-center justify-center'>
          스티치는 안전하고 신뢰할 수 있는 온라인 환경을 제공합니다. 모든 수업 기록과 자료는 안전하게 보관되며, 학생과 선생님의 개인정보는 철저히 보호됩니다.
          </div>
          <div>
            <p className='text-5xl text-right'>신뢰할 수 있는 시스템</p>
            <img src={mygraph} alt="" className='w-96 h-80' />
          </div>
        </div>
        <hr/>
        <span className='text-5xl'>편리한 시간 관리</span>
        <div className='flex'>
          <div>
            <img src={myschedule} alt="" className='w-96 h-80' />
                
          </div>
          <div className='flex items-center justify-center p-5'>
            언제 어디서나 접속 가능한 원격 수업 시스템을 통해 학생과 선생님이 편리한 시간에 수업을 진행할 수 있습니다.
            바쁜 일정 속에서도 효율적으로 학습할 수 있습니다.
          </div>
        </div>
        <hr/>
        <div className='flex'>
          <div className='flex items-center justify-center p-5'>
          초등학생부터 고등학생, 대학생까지 다양한 수준의 학생들을 위한 과목별 전문가 선생님들이 준비되어 있습니다.
          원하는 과목과 수준에 맞춰 선생님을 선택할 수 있습니다.
          </div>
          <div>
            <p className='text-5xl text-right'>다양한 과목 및 수준 지원</p>
            <img src={myteachers} alt="" className='w-96 h-80' />
          </div>
        </div>
        <hr/>
        <span className='text-5xl'>실시간 피드백 및 평가</span>
        <div className='flex'>
            <div>
        <img src={myvideo} alt="" className='w-96 h-80' />
        
        </div>
        <div className='flex items-center justify-center p-5'>
          수업 후 바로 피드백과 평가를 받아 학습 성과를 실시간으로 확인할 수 있습니다.
          이를 통해 학습 방향을 빠르게 조정하고 더욱 효율적인 학습이 가능합니다.
        </div>
        </div>
        <hr/>
        스티치와 함께라면 최고의 원격 과외 경험을 통해 학습 목표를 달성할 수 있습니다. 지금 바로 스티치에 가입하고 다양한 혜택을 누려보세요!
    </div>
    )
}

export default IntroductionSignUp;
