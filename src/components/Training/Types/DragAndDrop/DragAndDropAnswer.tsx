import { useState } from "react";
import styled from "@emotion/styled";
import { useAppSelector } from "../../../../redux/hooks";

interface BlankType {
  index: number;
  answer: string;
}

function DragAndDropAnswer() {
  const lessonState = useAppSelector(data => data.lesson)
  const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex]
  
  const [blanks, setBlanks] = useState<Array<Array<BlankType | string>>>([
    [
      { index: 0, answer: 'if' },
      " Fire Sprinkler is on ",
      { index: 1, answer: 'and' },
      " Water Valve is on",
    ],
    [
      { index: 0, answer: 'whether' },
      " Heater is on ",
      { index: 1, answer: 'then' },
      " Air Conditioner is of.",
    ],
  ]);

  const [correctAnswers, setCorrectAnswers] = useState<Array<Array<string>>>([
    ["if", "then"],
    ["if", "then"],
  ]);

  

  return (
    <Wrapper>
      <div className="label">
        <h2>Drag & Drop Answers</h2>
        <h3>Check the answers and see how you did!</h3>
        <p>
          Score: <b>5/10</b>
        </p>
      </div>
      <div className="answers">
        <ol className="blanks">
          {blanks.map((blank, bi) => (
            <li key={bi}>
              {blank.map((part, pi) =>
                typeof part !== "string" ? (
                  part.answer === correctAnswers[bi][part.index] 
                  ? <span className="correct-answer">{part.answer}</span>
                  : <>
                        <span className="wrong-answer">{part.answer}</span>
                        <span className="correct-answer">{correctAnswers[bi][part.index]}</span>
                    </>
                ) : (
                  <span key={pi}> {part}</span>
                )
              )}
            </li>
          ))}
        </ol>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    .correct-answer {
        padding: 2px 5px;
        background-color: #14A44D;
        border-radius: 4px;
        color: white;
    }
    .wrong-answer {
        padding: 2px 5px;
        background-color: #DC4C64;
        border-radius: 4px;
        margin-right: 5px;
        color: white;
        text-decoration: line-through;
    }
`;

export default DragAndDropAnswer;
