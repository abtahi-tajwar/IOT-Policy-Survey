import React from 'react'
import ReactMarkdown from 'react-markdown'
import styled from '@emotion/styled'
import { useAppSelector } from '../../redux/hooks'

function TrainingInstruction() {
  const lessonState = useAppSelector(data => data.lesson)
  const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex]
  return (
    <Wrapper>
        <div className="page-label">Instruction Page</div>
        <div className="instruction">
            <h1 style={{ textAlign: 'center' }}>{currentLesson.data.instructions.title}</h1>
            <ReactMarkdown children={currentLesson.data.instructions.description}/>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    flex: 1;
    overflow-y: auto;
    .page-label {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      padding: 6px 50px;
      background-color: #D9D9D9;
    }
    .instruction {
        width: 100%;
        margin-top: 50px;
        /* text-align: center; */
    }
`

export default TrainingInstruction