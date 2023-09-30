import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import Loader from "../../../Loader";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppSelector } from "../../../../redux/hooks";
import { CandidateLessonResponseType } from "../../../../interfaces/LessonType";
import { getCandidateLessonResponse } from "../../../../firebase/candidates";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import HelpIcon from '@mui/icons-material/Help';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';



interface MCQQuestionType {
  question: string;
  options: Array<string>;
  response: number;
  explanation: string;
}

function MCQAnswers() {
  const candidateId = useAppSelector<string>(data => data.candidate.id as string)
  const lessonState = useAppSelector(data => data.lesson)
  const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex]
  const [questions, setQuestions] = useState<Array<MCQQuestionType>>([]);
  const [answers, setAnswers] = useState<Array<number>>([]);
  const [candidateResponse, setCandidateResponse] = useState<CandidateLessonResponseType | null>(null);
  const [responsesLoading, setResponsesLoading] = useState<boolean>(true);
  const [explanationDialog, setExplanationDialog] = useState({
    open: false,
    content: ""
  })

  useEffect(() => {
      if (currentLesson && currentLesson.data.type === 'mcq') {
          getCandidateLessonResponse(candidateId, currentLesson.id).then(res => {
            if (res) {
              setCandidateResponse(res)
              setQuestions(currentLesson.data.questions.map((question, qi) => ({
                  question: question.question,
                  options: question.options,
                  response: res.data.responses[qi] as number,
                  explanation: question.answer.explanation
              })))
              setAnswers(currentLesson.data.questions.map(question => question.answer.index))
            }
            setResponsesLoading(false)
          })
      }
  }, [currentLesson])

  useEffect(() => {
    setResponsesLoading(true)
  }, [])

  const handleShowExplanation = (explanation : string) => {
    setExplanationDialog({
      open: true,
      content: explanation
    })
  }
  

  return (
    <Loader isLoading={responsesLoading}>
      <Wrapper>
        <div>
          <h3>Check the answers and see how you did!</h3>
          <p>
            Score: <b>{candidateResponse?.data.score}/{candidateResponse?.data.total}</b>
          </p>
        </div>
        <Box>
          {questions.map((question, qi) => (
              <FormControl key={qi} sx={{ display: 'block', mb: 2 }}>
                  <FormLabel id="demo-radio-buttons-group-label">
                      {qi+1}. {question.question}?
                  </FormLabel> &nbsp;
                  {question.explanation && <LightTooltip title={question.explanation}>
                    <Chip icon={<HelpIcon />} label="Explanation" onClick={() => handleShowExplanation(question.explanation)} />
                  </LightTooltip>}
                  <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                  >
                      {
                          question.options.map((option, oi) => (
                              <div className="answer-options">
                                  <FormControlLabel
                                      value={option}
                                      control={<Radio />}
                                      label={option}
                                      checked={question.response === oi}
                                      disabled
                                  />{" "}
                                  {oi === answers[qi] && <CheckCircleIcon style={{ color: "green" }} /> }
                                  {(question.response === oi && question.response !== answers[qi]) && <CancelIcon style={{ color: "red" }} /> }
                              </div>
                          ))
                      }
                  </RadioGroup>
              </FormControl>
          ))}
        </Box>
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
  .css-j204z7-MuiFormControlLabel-root .MuiFormControlLabel-label.Mui-disabled {
    color: black;
  }
  .answer-options {
    display: flex;
    gap: 2px;
    align-items: center;
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





export default MCQAnswers;
