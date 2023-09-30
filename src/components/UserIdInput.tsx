import React from 'react'
import styled from '@emotion/styled'
import { TextField, Button } from '@mui/material'
import { createNewCandidate } from '../firebase/candidates'
import Amazon_MC_TURK_IMAGE from '../assets/amazon_mc_turk.jpg'
import { DocumentReference, DocumentData } from 'firebase/firestore'
import { useAppDispatch } from '../redux/hooks'
import { updateCandidateId } from '../redux/slices/candidate'

interface UserIdInputType {
    setUserId: Function
}

function UserIdInput({ setUserId } : UserIdInputType) {
    const dispatch = useAppDispatch()
    const [input, setInput] = React.useState<string>('')
    const [submitLoading, setSubmitLoading] = React.useState<boolean>(false)
    const handleSubmit = (newUser: Boolean) => {
        if (!newUser) {
            setUserId(input.trim())
            dispatch(updateCandidateId(input.trim()))
        } else {
            setSubmitLoading(true)
            createNewCandidate().then((user : DocumentReference<DocumentData>) => {
                setUserId(user.id)
                dispatch(updateCandidateId(user.id))
                setSubmitLoading(false)
            }).catch(e => {
                setSubmitLoading(false)
            })
        }
    }
  return (
    <Wrapper>
        <div className='left-col'>
            <h1>New User? Start your survey from here</h1>
            <div>
                <Button 
                    variant="contained" 
                    onClick={() => handleSubmit(true)}
                    disabled={submitLoading}
                >Start Survey</Button>
            </div>
        </div>
        <div className='right-col'>
            {/* <img src={Amazon_MC_TURK_IMAGE} height="200px" /> */}
            <h1>Enter Your User ID To Continue the Survey</h1>
            <TextField
                id="outlined-multiline-static"
                label="User Id"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <div>
                <Button variant="contained" onClick={() => handleSubmit(false)}>Continue</Button>
            </div>
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
    gap: 10px;
    padding: 100px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .left-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #d6d4d4;
    }
    .right-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 10px;
    }
`

export default UserIdInput