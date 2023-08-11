import { Button as MuiButton } from '@mui/material'
import { LessonsGetType } from '../interfaces/LessonType'
import styled from '@emotion/styled'
import DragonAndDropIcon from '../assets/Lessons/drag_and_drop.svg'
import BrainIcon from '../assets/Lessons/brain.svg'
import PuzzleIcon from '../assets/Lessons/puzzle.svg'
import CompletedIcon from '../assets/Lessons/completed.svg'


interface TrainingPropsType {
    lessons: Array<LessonsGetType>
}

function Training({ lessons } : TrainingPropsType) {
    console.log("Lessons", lessons)
  return (
    <Wrapper>
      <div className="container">
        <div className="page-label">Instruction Page</div>
        <div className="content">
          Some content
        </div>
        <div className="stepper-flow-container">
          <div className="stepper-flow">
            <div className="stepper-flow-item completed">
              <div className="icon-container">
                <img src={CompletedIcon} />
              </div>
            </div>
            <div className="stepper-flow-item">
              <div className="icon-container">
                <img src={DragonAndDropIcon} />
              </div>
            </div>
            <div className="stepper-flow-item">
              <div className="icon-container">
                <img src={BrainIcon} />
              </div>
            </div>
            <div className="stepper-flow-item">
              <div className="icon-container">
                <img src={PuzzleIcon} />
              </div>
            </div>
          </div>
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

    .page-label {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      padding: 6px 50px;
      background-color: #D9D9D9;
    }
    .content {
      flex: 1;
      width: 100%;
      margin-top: 50px;
      overflow-y: auto;
    }
    .stepper-flow-container {
      display: flex;
      gap: 15px;
      width: 100%;
      .stepper-flow {
        display: flex;
        align-items: center;

        flex: 1;
        border-radius: 7px;
        background: #FFF;
        box-shadow: 0px 0px 6px -2px rgba(0, 0, 0, 0.25);
        padding: 5px 15px;
        &-item {
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex: 1;
          .icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25px;
            width: 25px;
            border-radius: 50%;
            background-color: #D9D9D9;
            img {
              height: 70%;
            }
          }
          &:last-child {
            flex: unset;
          }
          &::after {
            content: "";
            position: absolute;
            left: 25px;
            top: 50%;
            transform: translateY(-50%);
            height: 2px;
            width: calc(100% - 25px);
            background-color: #D9D9D9;
          }
        }
        &-item.completed {
          .icon-container {
            background-color: white;
            img {
              height: 100%;
            }
          }
          &::after {
            background-color: #14A44D;
          }
        }
      }
    }
  }
`


export default Training