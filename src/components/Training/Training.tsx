import { Button as MuiButton } from '@mui/material'
import { LessonsGetType } from '../../interfaces/LessonType'
import styled from '@emotion/styled'
import DragonAndDropIcon from '../../assets/Lessons/drag_and_drop.svg'
import BrainIcon from '../../assets/Lessons/brain.svg'
import PuzzleIcon from '../../assets/Lessons/puzzle.svg'
import CompletedIcon from '../../assets/Lessons/completed.svg'
import TrainingStepperFlow from './TrainingStepperFlow'
import TrainingContent from './TrainingContent'
import { useState } from 'react'
import TrainingInstruction from './TrainingInstruction'


interface TrainingPropsType {
    lessons: Array<LessonsGetType>
}

function Training({ lessons } : TrainingPropsType) {
    console.log("Lessons", lessons)

    const [isInstructionPage, setIsInstructionPage] = useState<boolean>(false)
  return (
    <Wrapper>
      <div className="container">
        {isInstructionPage ? 
          <TrainingInstruction /> : 
          <TrainingContent /> 
        }
        <div className="stepper-flow-container">
          <TrainingStepperFlow />
          <Button variant='contained'>Next</Button>
        </div>
      </div>
    </Wrapper>
  )
}

const Button = styled(MuiButton)`
  padding: 6px 50px;
`

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    position: relative;
    height: 80vh;
    width: 80vw;
    padding: 25px;
    box-sizing: border-box;
    margin: 0 auto;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 25px;

    .stepper-flow-container {
      display: flex;
      gap: 15px;
      width: 100%;
    }
  }
`


export default Training