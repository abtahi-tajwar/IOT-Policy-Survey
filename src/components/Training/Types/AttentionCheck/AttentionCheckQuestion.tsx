// type = attention_check
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { LessonsGetType } from '../../../../interfaces/LessonType'
import styled from '@emotion/styled'
import { Box } from '@mui/material'
import { Textarea } from '@mui/joy';
import { updateResponse } from '../../../../redux/slices/lesson_response'


interface AttentionCheckQuestionType {
    question: string,
    response: string
}

function AttentionCheckQuestion() {
    const lessonState = useAppSelector(data => data.lesson)
    const dispatch = useAppDispatch()
    const [questions, setQuestions] = useState<Array<AttentionCheckQuestionType>>([])
    const [currentLesson, setCurrentLesson] = useState<LessonsGetType | null>(null)

    useEffect(() => {
        setCurrentLesson(lessonState.lessons[lessonState.lessonNavigationIndex])
    }, [lessonState.lessonNavigationIndex])

    useEffect(() => {
        if (currentLesson) {
            setQuestions(currentLesson.data.questions.map(q => ({
                question: q.question,
                response: ""
            })))
        }
    }, [currentLesson])

    useEffect(() => {
        dispatch(updateResponse(questions.map(q => q.response)))
    }, [questions])

    const handleQuestionResponseUpdate = (e : React.ChangeEvent<HTMLTextAreaElement>, questionIndex : number) => {
        setQuestions(prevState => prevState.map((q, qi) => {
            if (qi === questionIndex) {
                return {
                    ...q,
                    response: e.target.value
                }
            }
            return q
        }))
    }

  return (
    <Wrapper>
        <div className="label">
          <h2>Extra Questions</h2>
          <h3>Answer the following questions</h3>
        </div>
        <Box>
            {questions.map((q, qi) => (
                <Box sx={{ mb: 4 }}>
                    <p>{q.question}</p>
                    <Textarea
                        placeholder="Answer here…"
                        minRows={4}
                        maxRows={6}
                        value={q.response}
                        onChange={(e) => handleQuestionResponseUpdate(e, qi)}
                    />
                </Box>
            ))}
        </Box>
    </Wrapper>
  )
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

export default AttentionCheckQuestion