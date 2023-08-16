import React from "react";
import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";
import DragonAndDropIcon from "../../assets/Lessons/drag_and_drop.svg";
import BrainIcon from "../../assets/Lessons/brain.svg";
import PuzzleIcon from "../../assets/Lessons/puzzle.svg";
import CompletedIcon from "../../assets/Lessons/completed.svg";

function TrainingStepperFlow() {
  return (
    <Wrapper>
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
  }
`;

export default TrainingStepperFlow;
