import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import MainImageSource from "../../assets/Lessons/main_image.png"
import MCQQuestions from "./Types/MCQ/MCQQuestions";
import MCQAnswers from "./Types/MCQ/MCQAnswers";
import DragAndDropQuestion from "./Types/DragAndDrop/DragAndDropQuestion";
import DragAndDropAnswer from "./Types/DragAndDrop/DragAndDropAnswer";
import { useAppSelector } from "../../redux/hooks";
import Loader from "../Loader";
import DemographicsQuestion from "./Types/Demographics/DemographicsQuestion";
import AttentionCheckQuestion from "./Types/AttentionCheck/AttentionCheckQuestion";
import { LessonsGetType } from "../../interfaces/LessonType";

interface TrainingContentPropsType {
  pageType: ('instruction' | 'question' | 'answer')
}

function TrainingContent({ pageType } : TrainingContentPropsType) {
    const lessonState = useAppSelector(data => data.lesson)
    const [isAnswerPage, setIsAnswerPage] = useState<boolean>(true)
    const [trainingType, setTrainingType] = useState<"mcq" | "dnd" | "demographics" | "attention_check" | null>(null)
    const [currentLesson, setCurrentLesson] = useState<LessonsGetType | null>(null)

    const questionTypeComponents = {
        mcq: <MCQQuestions />,
        dnd: <DragAndDropQuestion />,
        demographics: <DemographicsQuestion />,
        attention_check: <AttentionCheckQuestion />
    }

    const answerTypeComponents = {
        mcq: <MCQAnswers />,
        dnd: <DragAndDropAnswer />,
        demographics: null,
        attention_check: null
    }

    useEffect(() => {
      if (lessonState.lessons[lessonState.lessonNavigationIndex]) {
        setCurrentLesson(lessonState.lessons[lessonState.lessonNavigationIndex])
        setTrainingType(lessonState.lessons[lessonState.lessonNavigationIndex].data.type)
      }
    }, [lessonState.lessonNavigationIndex])

  return (
    <Loader isLoading={!trainingType}>
      {trainingType && <Wrapper>
        { currentLesson?.data.image && <div className="main-image-container">
          <img src={MainImageSource} />
        </div> }
        <div className="content-container">
          {
              pageType !== 'answer' ? (
                  questionTypeComponents[trainingType] 
              ) : (
                  answerTypeComponents[trainingType]
              )
          }
          
        </div>
      </Wrapper>}
    </Loader>
  );
}

const Wrapper = styled.div`
  flex: 1;
  height: 60vh;
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
    flex: 1;
    overflow-y: auto;
    .label {
        
    }
  }
`;

export default TrainingContent;
