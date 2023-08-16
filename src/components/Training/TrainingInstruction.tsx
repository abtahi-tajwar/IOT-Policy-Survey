import React from 'react'
import ReactMarkdown from 'react-markdown'
import styled from '@emotion/styled'

function TrainingInstruction() {
  return (
    <Wrapper>
        <div className="page-label">Instruction Page</div>
        <div className="instruction">
            <h1>How To Write A Simple Conditional Statement</h1>
            <ReactMarkdown children='**If** Fire Sprinkler is on **Then** Water Valve is on. **If** Heater is on **Then** Air Conditioner is of. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'/>
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
        text-align: center;
    }
`

export default TrainingInstruction