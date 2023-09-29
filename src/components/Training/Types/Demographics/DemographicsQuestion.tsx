// type = demographics
import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { updateResponse } from "../../../../redux/slices/lesson_response";
import { LessonsGetType } from "../../../../interfaces/LessonType";

interface DemographicsQuestionType {
    question: string,
    options: Array<string>,
    response: number
}

function DemographicsQuestion() {
    const lessonState = useAppSelector(data => data.lesson)
    // const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex]
    const dispatch = useAppDispatch()
    const [questions, setQuestions] = useState<Array<DemographicsQuestionType>>([])
    const [currentLesson, setCurrentLesson] = useState<LessonsGetType | null>(null)

    useEffect(() => {
        dispatch(updateResponse(questions.map(q => q.response)))
        // setAnswers(questions.map(q => q.response))
    }, [questions])

    useEffect(() => {
        setCurrentLesson(lessonState.lessons[lessonState.lessonNavigationIndex])
    }, [lessonState.lessonNavigationIndex])

    useEffect(() => {
        console.log("Current lesson state updated", currentLesson)
        if (currentLesson && currentLesson.data.type === 'demographics') {
            setQuestions(currentLesson.data.questions.map(question => ({
                question: question.question,
                options: question.options,
                response: -1
            })))
        }
    }, [currentLesson])

    const handleResponse = (questionIndex: number, optionIndex: number) => {
        setQuestions(prevState => prevState.map((question, qi) => {
            if (questionIndex === qi) {
                return {
                    ...question,
                    response: optionIndex
                }
            } 
            return question
        }))
    }
    
  return (
    <Wrapper>
        <div className="label">
          <h2>Demographics Questions</h2>
          <h3>Answer the following questions</h3>
        </div>
        <Box sx={{ ml: 2 }}>
        {questions.map((question, qi) => (
           <FormControl key={qi} sx={{ display: 'block', mb: 2 }}> 
                <FormLabel id="demo-radio-buttons-group-label">
                    {qi+1}. {question.question}
                </FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    {
                        question.options.map((o, oi) => (
                            <FormControlLabel
                                value={o}
                                control={<Radio />}
                                label={o}
                                onChange={() => handleResponse(qi, oi)}
                                checked={question.response === oi}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        ))}
        </Box>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    .label {
        margin: 0;
        padding: 0;
        line-height: 0.8rem;
        h2, h3 {
            font-weight: normal;
        }
    }
`

export default DemographicsQuestion;
