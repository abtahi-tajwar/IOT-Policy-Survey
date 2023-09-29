import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";
import DragonAndDropIcon from "../../assets/Lessons/drag_and_drop.svg";
import BrainIcon from "../../assets/Lessons/brain.svg";
import PuzzleIcon from "../../assets/Lessons/puzzle.svg";
import AttentionIcon from '../../assets/Lessons/attention.svg'
import InfoIcon from '../../assets/Lessons/info.svg'
import CompletedIcon from "../../assets/Lessons/completed.svg";
import { CandidateLessonResponseType } from "../../interfaces/LessonType";
import { useAppSelector } from "../../redux/hooks";

interface LessonsStepperFlowStateType {
  lessonType: ('dnd' | 'mcq' | 'demographics' | 'attention_check' ),
  isCompleted: boolean,
  isCurrent: boolean
}

function TrainingStepperFlow() {

  const lessonState = useAppSelector(data => data.lesson)
  const [lessonsStepperFlowState, setLessonsStepperFlowState] = useState<Array<LessonsStepperFlowStateType>>([])

  const TypeIconSrcMap = {
    dnd: DragonAndDropIcon,
    mcq: BrainIcon,
    demographics: InfoIcon,
    attention_check: AttentionIcon
  }

  useEffect(() => {
    if (lessonState.lessons) {
      setLessonsStepperFlowState(lessonState.lessons.map((l, li) => {
        if (lessonState.lessonResponses?.find(ccl => ccl.data.lesson.id === l.id)) {
          return {
            lessonType: l.data.type,
            isCompleted: true,
            isCurrent: lessonState.currentLessonIndex === li ? true : false
          }
        }
        return {
          lessonType: l.data.type,
          isCompleted: false,
          isCurrent: lessonState.currentLessonIndex === li ? true : false
        }
      }))
    }
  }, [lessonState.lessonResponses])
  

  return (
    <Wrapper>
      <div className="stepper-flow">
        {
          lessonsStepperFlowState.map((sf, sfi) => (
            sf.isCompleted
              ? <div key={sfi} className="stepper-flow-item completed">
                <div className="icon-container">
                  <img src={CompletedIcon} />
                </div>
              </div>
              : <div key={sfi} className={`stepper-flow-item ${lessonState.lessonNavigationIndex === sfi && 'current'}`}>
                <div className="icon-container">
                  <img src={TypeIconSrcMap[sf.lessonType]} />
                </div>
              </div>
          ))
        }
        {/* <div className="stepper-flow-item completed">
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
        </div> */}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  .stepper-flow {
    display: flex;
    align-items: center;

    flex: 1;
    border-radius: 7px;
    background: #fff;
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
        background-color: #d9d9d9;
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
        background-color: #d9d9d9;
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
        background-color: #14a44d;
      }
    }
    &-item.current {
      .icon-container {
        border: 1px solid black;
      }
    }
  }
`;

export default TrainingStepperFlow;
