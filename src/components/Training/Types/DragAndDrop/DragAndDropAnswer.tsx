import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useAppSelector } from "../../../../redux/hooks";
import {
  CandidateLessonResponseType,
  DnDResponseType,
} from "../../../../interfaces/LessonType";
import { getCandidateLessonResponse } from "../../../../firebase/candidates";
import Loader from "../../../Loader";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import HelpIcon from '@mui/icons-material/Help';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

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
  const [explanationDialog, setExplanationDialog] = useState({
      open: false,
      content: ""
    })

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
  const [explanations, setExplanations] = useState<Array<string | undefined>>([])
  const [score, setScore] = useState({
    total: 0,
    obtained: 0,
  })

  useEffect(() => {
    setCandidateResponseLoading(true);
    if (currentLesson && currentLesson.data.type === "dnd") {
      getCandidateLessonResponse(candidateId, currentLesson.id).then((res) => {
        console.log("Candidate response", res);
        if (res) {
          setCandidateResponse(res);
          const _blanks : Array<Array<BlankType | string>> = [];
          const _correctAnswers: Array<Array<string>> = [];
          const _explanations : Array<string | undefined> = []
          let _totalScore = 0
          let _obtainedScore = 0

          currentLesson.data.blanks.forEach((blank, bi) => {
            console.log("Each blank data", blank)
            _blanks.push([])
            _explanations.push(blank.explanation)
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
          setExplanations(_explanations)
          setScore({
            total: _totalScore,
            obtained: _obtainedScore
          })
        }
        setCandidateResponseLoading(false);
      });
    }
  }, [currentLesson]);

  const handleShowExplanation = (explanation : string) => {
    setExplanationDialog({
      open: true,
      content: explanation
    })
  }

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
                )} &nbsp;
                {explanations[bi] && <LightTooltip title={explanations[bi]}>
                    <Chip icon={<HelpIcon />} label="Explanation" onClick={() => handleShowExplanation(explanations[bi] ?? "")} />
                </LightTooltip>}
              </li>
              
            ))}
          </ol>
        </div>
        <BootstrapDialog
          onClose={() => setExplanationDialog(prevState => ({ ...prevState, open: false }))}
          aria-labelledby="customized-dialog-title"
          open={explanationDialog.open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Answer Explanation
          </DialogTitle>
          <DialogContent dividers>
            {explanationDialog.content}
          </DialogContent>
        </BootstrapDialog>
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
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme } : any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: '5px 6px 2px 0px rgba(0,0,0,0.75);',
    fontSize: 11,
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 16,
  },
  '& .MuiDialogActions-root': {
    padding: 16,
  },
}));


export default DragAndDropAnswer;
