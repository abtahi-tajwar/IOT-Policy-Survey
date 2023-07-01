import React from 'react'
import { IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import styled from '@emotion/styled';

interface TextCopierArgs {
    text: string
}

function TextCopier({ text } : TextCopierArgs) {
    const [hasCopied, setHasCopied] = React.useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setHasCopied(true)
        setTimeout(() => {
            setHasCopied(false)
        }, 5000)
    }
  return (
    <Wrapper>
        <p>{text}</p>
        {!hasCopied ? 
            <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
            </IconButton> : 
            <DoneIcon color='primary' /> 
        }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    p {
        font-weight: bold;
    }
`

export default TextCopier