import React from 'react'
import styled from '@emotion/styled'
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function MCQAnswers() {
  return (
    <Wrapper>
        <div>
            <h3>Check the answers and see how you did!</h3>
            <p>Score: <b>10/10</b></p>
        </div>

        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
                1. What is your favourite pet's name?
            </FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
            >
                <div className='answer-options'>
                    <FormControlLabel
                        value="lambo"
                        control={<Radio />}
                        label="Lamborghini"
                        checked
                        disabled
                    /> <CheckCircleIcon style={{ color: 'green' }} />
                </div>
                <div className='answer-options'>
                    <FormControlLabel
                        value="bughatti"
                        control={<Radio />}
                        label="Bughatti"
                        disabled
                    /> <CancelIcon style={{ color: 'red' }} />
                </div>
                <div className='answer-options'>
                    <FormControlLabel 
                        value="other" 
                        control={<Radio />} 
                        label="Other" 
                        disabled
                    />
                </div>
            </RadioGroup>
        </FormControl>
    </Wrapper>
  )
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
`

export default MCQAnswers