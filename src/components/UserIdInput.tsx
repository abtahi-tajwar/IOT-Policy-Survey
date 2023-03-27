import React from 'react'
import styled from '@emotion/styled'
import { TextField, Button } from '@mui/material'
import Amazon_MC_TURK_IMAGE from '../assets/amazon_mc_turk.jpg'

interface UserIdInputType {
    setUserId: Function
}

function UserIdInput({ setUserId } : UserIdInputType) {
    const [input, setInput] = React.useState<string>('')
    const handleSubmit = () => {
        setUserId(input)
    }
  return (
    <Wrapper>
        <img src={Amazon_MC_TURK_IMAGE} height="200px" />
        <h1>Enter Your User ID of Amazon Mechanical Turk</h1>
        <TextField
            id="outlined-multiline-static"
            label="User Id"
            value={input}
            onChange={e => setInput(e.target.value)}
        />
        <div>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    gap: 10px;
    padding: 100px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
`

export default UserIdInput