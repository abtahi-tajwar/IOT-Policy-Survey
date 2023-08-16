import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import styled from "@emotion/styled";

function MCQQuestions() {
  return (
    <Wrapper>
        <div className="label">
          <h2>MCQ Questions</h2>
          <h3>Answer the following questions</h3>
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
                <FormControlLabel
                    value="lambo"
                    control={<Radio />}
                    label="Lamborghini"
                />
                <FormControlLabel
                    value="bughatti"
                    control={<Radio />}
                    label="Bughatti"
                />
                <FormControlLabel 
                    value="other" 
                    control={<Radio />} 
                    label="Other" 
                />
            </RadioGroup>
        </FormControl>
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

export default MCQQuestions;
