import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useAppSelector } from "../../../../redux/hooks";
import {
  CandidateLessonResponseType,
  DnDResponseType,
} from "../../../../interfaces/LessonType";
import { getCandidateLessonResponse } from "../../../../firebase/candidates";
import Loader from "../../../Loader";

interface BlankType {
  index: number;
  answer: string;
}

function DragAndDropAnswer() {
  const candidateId = useAppSelector<string>(
    (data) => data.candidate.id as string
  );
  const lessonState = useAppSelector((data) => data.lesson);
  const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex];
  const [candidateResponse, setCandidateResponse] =
    useState<CandidateLessonResponseType | null>(null);
  const [candidateResponseLoading, setCandidateResponseLoading] =
    useState<boolean>(true);

  const [blanks, setBlanks] = useState<Array<Array<BlankType | string>>>([
    [
      { index: 0, answer: "if" },
      " Fire Sprinkler is on ",
      { index: 1, answer: "and" },
      " Water Valve is on",
    ],
    [
      { index: 0, answer: "whether" },
      " Heater is on ",
      { index: 1, answer: "then" },
      " Air Conditioner is of.",
    ],
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<Array<Array<string>>>([
    ["if", "then"],
    ["if", "then"],
  ]);
  const [score, setScore] = useState({
    total: 0,
    obtained: 0,
  })


  useEffect(() => {
    console.log("Blanks", blanks)
    console.log("Correct Answers", correctAnswers)
  }, [blanks, correctAnswers])
  useEffect(() => {
    setCandidateResponseLoading(true);
    if (currentLesson && currentLesson.data.type === "dnd") {
      getCandidateLessonResponse(candidateId, currentLesson.id).then((res) => {
        console.log("Candidate response", res);
        if (res) {
          setCandidateResponse(res);
          const _blanks : Array<Array<BlankType | string>> = [];
          const _correctAnswers: Array<Array<string>> = [];
          let _totalScore = 0
          let _obtainedScore = 0

          currentLesson.data.blanks.forEach((blank, bi) => {

            _blanks.push([])
            let _answerIndex = 0
            const _blankResponses : Array<DnDResponseType> = res.data.responses[bi] as Array<DnDResponseType>
            blank.question.forEach((part, pi) => {
              if (part === '{{blank}}') {
                // Calculate total score
                _totalScore += 1
                // Calculate obtained score
                if (_blankResponses[_answerIndex].answer === blank.answers[_answerIndex]) {
                  _obtainedScore += 1
                }
                _blanks[bi].push({
                  index: _answerIndex,
                  answer: _blankResponses[_answerIndex].answer
                })
                _answerIndex += 1
              } else {
                _blanks[bi].push(part)
              }
            })

            _correctAnswers.push(blank.answers)
          });

          setBlanks(_blanks)
          setCorrectAnswers(_correctAnswers)
          setScore({
            total: _totalScore,
            obtained: _obtainedScore
          })
        }
        setCandidateResponseLoading(false);
      });
    }
  }, [currentLesson]);

  return (
    <Loader isLoading={candidateResponseLoading}>
      <Wrapper>
        <div className="label">
          <h2>Drag & Drop Answers</h2>
          <h3>Check the answers and see how you did!</h3>
          <p>
            Score: <b>{score.obtained}/{score.total}</b>
          </p>
        </div>
        <div className="answers">
          <ol className="blanks">
            {blanks.map((blank, bi) => (
              <li key={bi}>
                {blank.map((part, pi) =>
                  typeof part !== "string" ? (
                    part.answer === correctAnswers[bi][part.index] ? (
                      <span className="correct-answer">{part.answer}</span>
                    ) : (
                      <>
                        <span className="wrong-answer">{part.answer}</span>
                        <span className="correct-answer">
                          {correctAnswers[bi][part.index]}
                        </span>
                      </>
                    )
                  ) : (
                    <span key={pi}> {part}</span>
                  )
                )}
              </li>
            ))}
          </ol>
        </div>
      </Wrapper>
    </Loader>
  );
}

const Wrapper = styled.div`
  .correct-answer {
    padding: 2px 5px;
    background-color: #14a44d;
    border-radius: 4px;
    color: white;
  }
  .wrong-answer {
    padding: 2px 5px;
    background-color: #dc4c64;
    border-radius: 4px;
    margin-right: 5px;
    color: white;
    text-decoration: line-through;
  }
`;

export default DragAndDropAnswer;
