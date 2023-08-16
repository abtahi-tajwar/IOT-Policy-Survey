import React, { useRef, useState } from "react";
import styled from "@emotion/styled";

interface OptionType {
  label: string,
  value: string
}
interface BlankType {
  index: number,
  answer: OptionType
}
interface DraggedOption {
  hasDropped: boolean,
  option: OptionType
}

function DragAndDropQuestion() {

  const [options, setOptions] = useState<Array<OptionType>>([
    { label: "If", value: "if" },
    { label: "Then", value: "then" },
    { label: "And", value: "and" },
    { label: "Or", value: "or" },
    { label: "But", value: "but" },
  ])
  const [blanks, setBlanks] = useState<Array<Array<BlankType | string>>>([
    [ {index: 0, answer: { label: '', value: ''} }, ' Fire Sprinkler is on ', {index: 1, answer: { label: '', value: ''} }, ' Water Valve is on' ],
    [ {index: 0, answer: { label: '', value: ''} }, ' Heater is on ', {index: 1, answer: { label: '', value: ''} }, ' Air Conditioner is of.' ],
  ])
  const [currentDraggedItem, setCurrentDraggedItem] = useState<OptionType | null>(null)

  const handleDragStart = (e: any) => {
    setCurrentDraggedItem({
      label: e.target.innerHTML,
      value: e.target.dataset.value
    })
    e.dataTransfer.setData('application/json', {
      label: e.target.innerHTML,
      value: e.target.dataset.value
    });
  }
  const handleDrop = (e:any, blankIndex: number, part: BlankType) => {
    console.log("Dropped blank information", blankIndex, part)
    setBlanks(prevState => prevState.map((blank, i) => {
      if (i === blankIndex) {
        return blank.map((p : BlankType | string) => {
          if (typeof p !== 'string') {
            if (p.index === part.index) {
              return {
                ...p,
                answer: currentDraggedItem ?? { value: '', label: '' }
              }
            }
            return p
          }
          return p
        })
      }
      return blank
    }))
    setOptions(options.filter(o => o.value !== currentDraggedItem?.value))
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
                answer: { value: '', label: '' }
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
                key={option.value} 
                className="option" 
                data-value={option.value} 
                onDragStart={handleDragStart} 
                draggable
              >
                  {option.label}
              </div>
            )) 
          }
        </div>
        <ol className="blanks">
          { 
            blanks.map((blank, blankIndex) => (
              <li key={blankIndex}>
                {
                  blank.map((part) => (
                    (typeof part !== 'string' && Object.hasOwn(part, 'answer')) ? (
                      <span 
                        key={part.index} 
                        data-index={part.index}
                        onDragOver={e => e.preventDefault()}
                        onDragEnter={e => e.preventDefault()}
                        onDragLeave={e => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, blankIndex, part)}
                      >
                        { 
                          part.answer.value === '' ? 
                            <>_______</> : 
                            <span 
                              className="gap-answer"
                              data-value={part.answer.value}
                              onClick={() => removeAnswer(blankIndex, part)}
                            >{part.answer.label}</span> 
                        }
                      </span>
                    ) :
                    (
                      <>
                        {part}
                      </>
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
