import React, { useState } from "react";
import styled from "@emotion/styled";
import MainImageSource from "../../assets/Lessons/main_image.png"
import MCQQuestions from "./Types/MCQ/MCQQuestions";
import MCQAnswers from "./Types/MCQ/MCQAnswers";
import DragAndDropQuestion from "./Types/DragAndDrop/DragAndDropQuestion";

function TrainingContent() {
    const [isAnswerPage, setIsAnswerPage] = useState<boolean>(false)
    const [trainingType, setTrainingType] = useState<"mcq" | "dnd">("dnd")

    const questionTypeComponents = {
        mcq: <MCQQuestions />,
        dnd: <DragAndDropQuestion />
    }

    const answerTypeComponents = {
        mcq: <MCQAnswers />,
        dnd: null
    }
  return (
    <Wrapper>
      <div className="main-image-container">
        <img src={MainImageSource} />
      </div>
      <div className="content-container">
        {
            !isAnswerPage ? (
                questionTypeComponents[trainingType] 
            ) : (
                answerTypeComponents[trainingType]
            )
        }
        
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 50px;

  display: flex;
  gap: 50px;
  .main-image-container {
    width: 600px;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
  }
  .content-container {
    overflow-y: auto;
    .label {
        
    }
  }
`;

export default TrainingContent;
