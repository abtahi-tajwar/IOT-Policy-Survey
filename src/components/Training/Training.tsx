import { Button as MuiButton } from '@mui/material'
import { CandidateLessonResponseType, LessonsGetType } from '../../interfaces/LessonType'
import styled from '@emotion/styled'
import DragonAndDropIcon from '../../assets/Lessons/drag_and_drop.svg'
import BrainIcon from '../../assets/Lessons/brain.svg'
import PuzzleIcon from '../../assets/Lessons/puzzle.svg'
import CompletedIcon from '../../assets/Lessons/completed.svg'
import TrainingStepperFlow from './TrainingStepperFlow'
import TrainingContent from './TrainingContent'
import React, { useState, useEffect, createContext } from 'react'
import TrainingInstruction from './TrainingInstruction'
import { getCompletedLessons } from '../../firebase/candidates'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getLessonResponse, initializeNavigationIndex, navigateToNextLesson, updateCurrentLesson } from '../../redux/slices/lesson'
import { SubmitLessonResponseArgument, submitLessonResponse } from '../../firebase/lessons'
import CircularProgress from '@mui/material/CircularProgress';


import Loader from '../Loader'


interface TrainingPropsType {
    candidateId: string,
    setNavigateToLesson: React.Dispatch<React.SetStateAction<boolean>>
}

interface LessonsStepperFlowStateType {
  lessonType: ('dnd' | 'mcq'),
  isCompleted: boolean,
  isCurrent: boolean
}

interface DndBlankType {
  index: number;
  answer: string;
}

function Training({ candidateId, setNavigateToLesson } : TrainingPropsType) {

    const dispatch = useAppDispatch()
    const lessonState = useAppSelector(data => data.lesson)
    const lessonResponse = useAppSelector<Array<number | Array<DndBlankType>>>(data => data.lessonResponse.data)
    const [submitAnswerLoading, setSubmitAnswerLoading] = useState<boolean>(false)
    const [lessonNavigationLoading, setLessonNavigationLoading] = useState<boolean>(false)
    const [pageType, setPageType] = useState<'instruction' | 'question' | 'answer'>('instruction')

    useEffect(() => {
      dispatch(getLessonResponse(candidateId)).then(() => {
        dispatch(updateCurrentLesson())
        dispatch(initializeNavigationIndex())
      })
    }, [])

    useEffect(() => {
      if (lessonState.lessonNavigationIndex === -1 || lessonState.lessonNavigationIndex === lessonState.lessons.length) {
        setNavigateToLesson(false)
      }
    }, [lessonState.lessonNavigationIndex])

    const navigateLesson = () => {
      return new Promise(async (resolve : (arg : void) => void, reject) => {
        try {
          await dispatch(getLessonResponse(candidateId))
          await dispatch(updateCurrentLesson())
          dispatch(navigateToNextLesson())
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }

    const handleInstructionNext = () => {
      setPageType('question')
    }
    const handleQuestionPrevious = () => {
      setPageType('instruction')
    }
    const handleSubmit = () => {
      setSubmitAnswerLoading(true)
      // Submit answers to the database
      const { score, total } = determineScore()
      
      if (lessonState.lessons[lessonState.lessonNavigationIndex]) {
        const lessonResponseData : SubmitLessonResponseArgument = {
          candidateId: candidateId,
          responses: lessonResponse,
          lessonId: lessonState.lessons[lessonState.lessonNavigationIndex].id,
          lessonType: lessonState.lessons[lessonState.lessonNavigationIndex].data.type,
          score, total
        }
        console.log("Lesson repsonse data", lessonResponseData )
        submitLessonResponse(lessonResponseData).then(() => {
          setSubmitAnswerLoading(false)
          setPageType('answer')
        }).catch(e => {
          console.log("Failed to submit responses", e)
        })
        
      }
    }
    const handleAnswerNext = () => {
      // Call "fetchCandidateResponses" api 
      // It will update stepper flow to go next lesson
      setLessonNavigationLoading(true)
      navigateLesson().then(() => {
        setLessonNavigationLoading(false)
        setPageType('instruction')
      })
    }
    
    const determineScore = () => {
      let score : number = 0
      let total : number = 0

      const _currentLesson = lessonState.currentLesson
      if (_currentLesson?.data.type === 'mcq') {
        _currentLesson.data.questions.forEach((question, qi) => {
          if (lessonResponse[qi]) score += (question.answer.index === lessonResponse[qi]) ? 1 : 0
          total += 1
        })
      } else if (_currentLesson?.data.type === 'dnd') {
        _currentLesson.data.blanks.forEach((blank, bi) => {
          blank.answers.forEach((answer, ai) => {
            const blankAnswers = lessonResponse[bi] as Array<DndBlankType>
            if (lessonResponse[bi]) score += (answer === blankAnswers[ai]?.answer) ? 1 : 0
            total += 1
          })
        })
      }

      return { score, total }
    }
  return (
    <Loader isLoading={lessonState.loading.initializeNavigationIndex}>
      <Wrapper>
        <div className="container">
          {pageType === 'instruction' ? 
            <TrainingInstruction /> : 
            <TrainingContent pageType={pageType}/> 
          }
          <div className="stepper-flow-container">
            <TrainingStepperFlow />

            {/* In case of instruction page */}
            {
              pageType === 'instruction' && <Button variant='contained' onClick={handleInstructionNext}>Next</Button>
            }
            {/* In case of question page */}
            {
              pageType === 'question' && (
                <>
                  <Button variant='outlined' onClick={handleQuestionPrevious} disabled={submitAnswerLoading}>Previous</Button>
                  <Button variant='contained' onClick={handleSubmit} disabled={submitAnswerLoading}>
                    { submitAnswerLoading ? <CircularProgress size={15} /> : 'Submit' }
                  </Button>
                </>
              )
            }
            {/* In case of answer page */}
            {
              pageType === 'answer' && (
                <>
                  <Button variant='contained' sx={{ whiteSpace: 'nowrap' }} onClick={handleAnswerNext} disabled={lessonNavigationLoading}>
                    {
                      lessonNavigationLoading ? <CircularProgress size={15} /> : (
                        (lessonState.lessonNavigationIndex === (lessonState.lessons.length - 1)) ? 'Finish Test' : 'Next Lesson'
                      )
                    }
                  </Button>
                </>
              )
            }
          </div>
        </div>
      </Wrapper>
    </Loader>
  )
}

const Button = styled(MuiButton)`
  padding: 6px 50px;
`

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    position: relative;
    height: 80vh;
    width: 80vw;
    padding: 25px;
    box-sizing: border-box;
    margin: 0 auto;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 25px;

    .stepper-flow-container {
      display: flex;
      gap: 15px;
      width: 100%;
    }
  }
`


export default Training