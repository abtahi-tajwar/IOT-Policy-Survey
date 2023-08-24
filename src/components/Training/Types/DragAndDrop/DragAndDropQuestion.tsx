import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { updateResponse } from "../../../../redux/slices/lesson_response";

interface OptionType {
  label: string,
  value: string
}
interface BlankType {
  index: number,
  answer: string
}
interface DraggedOption {
  hasDropped: boolean,
  option: OptionType
}

function DragAndDropQuestion() {
  const lessonState = useAppSelector(data => data.lesson)
  const currentLesson = lessonState.lessons[lessonState.lessonNavigationIndex]
  const dispatch = useAppDispatch()
  const [options, setOptions] = useState<Array<string>>([ 'if', 'then', 'and', 'or', 'but' ])
  const [blanks, setBlanks] = useState<Array<Array<BlankType | string>>>([
    [ {index: 0, answer: '' }, ' Fire Sprinkler is on ', {index: 1, answer: '' }, ' Water Valve is on' ],
    [ {index: 0, answer: '' }, ' Heater is on ', {index: 1, answer: '' }, ' Air Conditioner is of.' ],
  ])
  const [currentDraggedItem, setCurrentDraggedItem] = useState<string | null>(null)

  useEffect(() => {
    if (currentLesson) {
      setOptions(currentLesson.data.options)
      setBlanks(currentLesson.data.blanks.map((blank, bi) => {
        let blankIndex = -1
        return blank.question.map(part => {
          if (part === '{{blank}}')  {
            blankIndex += 1
            return { index: blankIndex, answer: '' }
          }
          return part
        })
      }))
    }
  }, [currentLesson])

  const handleDragStart = (e: any) => {
    setCurrentDraggedItem(e.target.dataset.value)
    e.dataTransfer.setData('application/json', {
      label: e.target.innerHTML,
      value: e.target.dataset.value
    });
  }
  const handleDrop = (blankIndex: number, part: BlankType) => {
    console.log("Dropped blank information", blankIndex, part)
    setBlanks(prevState => prevState.map((blank, i) => {
      if (i === blankIndex) {
        return blank.map((p : BlankType | string) => {
          if (typeof p !== 'string') {
            if (p.index === part.index) {
              return {
                ...p,
                answer: currentDraggedItem ?? ''
              }
            }
            return p
          }
          return p
        })
      }
      return blank
    }))
    setOptions(options.filter(o => o !== currentDraggedItem))
  }

  function removeAnswer(blankIndex: number, part: BlankType): void {
    setOptions(prevState => [ ...prevState, part.answer ])
    setBlanks(prevState => prevState.map((blank, i) => {
      if (i === blankIndex) {
        return blank.map((p : BlankType | string) => {
          if (typeof p !== 'string') {
            if (p.index === part.index) {
              return {
                ...p,
                answer: ''
              }
            }
            return p
          }
          return p
        })
      }
      return blank
    }))
  }

  useEffect(() => {
    dispatch(updateResponse( blanks.map(blank => blank.filter(part => typeof part !== 'string')) as Array<Array<BlankType>> ))
  }, [blanks])

  return (
    <Wrapper>
      <div className="label">
        <h2>Drag & Drop Questions</h2>
        <h3>Drag the correct option from the given items, and drop the appropriate blank</h3>
      </div>
      <div className="dnd_content">
        <div className="options drag_items">
          { options.map(option => (
              <div 
                key={option} 
                className="option" 
                data-value={option} 
                onDragStart={handleDragStart} 
                draggable
              >
                  {option}
              </div>
            )) 
          }
        </div>
        <ol className="blanks">
          { 
            blanks.map((blank, blankIndex) => (
              <li key={blankIndex}>
                {
                  blank.map((part, pi) => (
                    (typeof part !== 'string' && Object.hasOwn(part, 'answer')) ? (
                      <span 
                        key={pi} 
                        data-index={part.index}
                        onDragOver={e => e.preventDefault()}
                        onDragEnter={e => e.preventDefault()}
                        onDragLeave={e => e.preventDefault()}
                        onDrop={(e) => handleDrop(blankIndex, part)}
                      >
                        { 
                          part.answer === '' ? 
                            <>_______</> : 
                            <span 
                              className="gap-answer"
                              data-value={part.answer}
                              onClick={() => removeAnswer(blankIndex, part)}
                            >{part.answer}</span> 
                        }
                      </span>
                    ) :
                    (
                      <span key={pi}>
                        {(typeof part === 'string') && part}
                      </span>
                    )
                  ))
                }
              </li>
            )) 
          }
        </ol>
      </div>
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
        line-height: 1.3rem;
    }
  }

  .dnd_content {
    .options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      .option {
        padding: 5px 10px;
        background-color: #D9E5FE;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
      }
    }
    .blanks {
      line-height: 2rem;
      .gap-answer {
        padding: 2px 5px;
        background-color: #D9E5FE;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

export default DragAndDropQuestion;
