import React from 'react'
import styled from '@emotion/styled'
import ReactMarkdown from 'react-markdown'
import { TextField, Button } from '@mui/material'
import { SceneGetType } from '../interfaces/SceneType'
import PreLoader from '../assets/Preloader.gif'
import { create as createResponse } from '../firebase/response'
import { ResponseType, ResponseStatusType } from '../interfaces/ResponseType'
import { generateCandidateCompletionToken } from '../firebase/candidates'

interface SceneProps {
    userId: string,
    scene: SceneGetType | null /** Data Of Scene */,
    atLastScene: boolean, /** If At Last scene, next button will be disabled */
    goToNextScene: Function,
    hasUserAlreadyTookTest: boolean | null,
    invalidId: boolean
}

function Scene({ userId, scene, atLastScene, goToNextScene, hasUserAlreadyTookTest, invalidId } : SceneProps) {
    const [loading, setLoading] = React.useState<boolean>(true)
    /** 0 = Response not submitted */
    const [responseStatus, setResponseStatus] = React.useState<ResponseStatusType>({
        status: 'not_submitted',
        message: 'Your Response Is Not Attempted For Submission Yet'
    })
    const [scenarioMd, setScenarioMd] = React.useState<string>(`Failed to load data`)
    const [instructionMd, setInstructionMd] = React.useState<string>(`Failed to load data`)
    const [completionToken, setCompletionToken] = React.useState<string>('')
    const [policyInput, setPolicyInput] = React.useState<string>('')
    const [startingTime, setStartingTime] = React.useState<number>((new Date()).getTime())
    const [testFinished, setTestFinished] = React.useState<boolean>(false)

    React.useEffect(() => {
        console.log("Scene", scene)
        if (scene && hasUserAlreadyTookTest !== null) {
            setResponseStatus({
                status: 'not_submitted',
                message: 'Your Response Is Not Attempted For Submission Yet'
            })
            setScenarioMd(scene.data.scenario_markdown)
            setInstructionMd(scene.data.instruction_markdown)
            setLoading(false)
            setStartingTime((new Date()).getTime())
            setPolicyInput('')
        }
    }, [scene, hasUserAlreadyTookTest])

    React.useEffect(() => {
        if (hasUserAlreadyTookTest) {
            setLoading(true)
            generateCandidateCompletionToken(userId).then(res => {
                setCompletionToken(res)
                setLoading(false)
            })
        }
    }, [hasUserAlreadyTookTest])
    

    const handleSubmit = () => {
        setResponseStatus({
            status: 'loading',
            message: 'Checking & Submitting Your Response'
        })
        const userResponse : ResponseType = {
            userId,
            timeRequired: (new Date()).getTime() - startingTime,
            sceneId: scene ? scene.id : '',
            sceneName: scene ? scene.data.name : '',
            answer: policyInput
        }
        createResponse(userResponse).then(async (res) => {
            if (atLastScene) {
                try {
                    const token = await generateCandidateCompletionToken(userId)
                    setCompletionToken(token)
                } catch (e) {
                    console.log("Failed to generate completion token", e)
                }
            } 
            if (res) {
                setResponseStatus({
                    status: 'successful',
                    message: 'We got your answer!'
                })
            } else {
                setResponseStatus({
                    status: 'failed',
                    message: "Sorry! We don't allow multiple submission from one User Id"
                })
            }
        })
        
    }
    const handleFinish = () => {
        setTestFinished(true)
    }
    const handleGoToNextScene = () => {
        if (!atLastScene) {
            goToNextScene()
        }
    }
  return (
    <Wrapper>
        
        {!invalidId ? 
            <>
                {!hasUserAlreadyTookTest ? (
                    !testFinished ? (
                        <>
                        {!loading ? 
                        (
                            <div className='content-container'>
                                {
                                    responseStatus.status == 'loading' && (
                                        <div className="loading submit-loading">
                                            <h1>{responseStatus.message}</h1>
                                            <img src={PreLoader} />
                                        </div>
                                    )
                                }
                                {
                                    (responseStatus.status == 'successful' || responseStatus.status == 'failed') && (
                                        <div className="loading submit-loading">
                                            <h1>{responseStatus.message}</h1>
                                            {atLastScene ? 
                                                <Button variant="contained" onClick={handleFinish}>Finish</Button> : 
                                                <Button variant="contained" onClick={handleGoToNextScene}>Next Scene</Button> 
                                            }
                                        </div>
                                    )
                                }
                                <div className='heading-label'>
                                    <div className='userId'>User Id: {userId}</div>
                                    <div>No Training Mockup</div>
                                </div>
                                <div className='content'>
                                    <div className="column">
                                        <div className='scenario'>
                                            <h1>Scenario</h1>
                                            <ReactMarkdown children={scenarioMd}  />
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className='instruction'>
                                            <h1>Instruction</h1>
                                            <ReactMarkdown children={instructionMd}  />
                                        </div>
                                        <div className='input-container'>
                                            <h1>Answer</h1>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Policy Input"
                                                multiline
                                                rows={4}
                                                placeholder="If Presence is set to 'Away' then smart door must be locked"
                                                value={policyInput}
                                                onChange={e => setPolicyInput(e.target.value)}
                                            />
                                            <div>
                                                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            ) :
                            (
                                <div className='loading'>
                                    <h1>Loading Data</h1>
                                    <img src={PreLoader} />
                                </div>
                            )
                        }
                        </>
                    ) : (
                        <div className='instructions'>
                            <p>Here is your completion token</p><b>{completionToken}</b>
                            <p><i>Note: Please copy this completion token and submit to your AWS mechanical turk account to complete the survey and receive any compensation (if Available), you may also be able to login with your user id and retreive your completion token</i></p>
                            <p>Thank you for taking part in the test! Your help will play a crucial role in science</p>
                        </div>
                    )
                ) : (
                    <div className='instructions'>
                        <h1>You Already Took the test!</h1>
                        <p>Here is your completion token</p><b>{completionToken}</b>
                        <p><i>Note: Please copy this completion token and submit to your AWS mechanical turk account to complete the survey and receive any compensation (if Available), you may also be able to login with your user id and retreive your completion token</i></p>
                        <p>Every user with can only take the test ony one time. Thank you for your interest!</p>
                    </div>
                )}
            </> : 
            <div className='loading'>
                <h1>Invalid ID!</h1>
                <p>Seems like you have put a wrong user ID.</p>
            </div>
        }
            
    </Wrapper>
  )
}

const Wrapper = styled.div`
    .content-container {
        .content {
            display: flex;
            gap: 15px;
            .column {
                flex: 1;
                display: flex;
                gap: 10px;
                flex-direction: column;

            }
        }
        @media screen and (max-width: 800px) {
            .content {
                flex-direction: column;
            }
        }
        .heading-label {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 10px;
            box-sizing: border-box;
        }
        .scenario {
            flex: 1;
            border-left: 5px solid #e6e6fa;
            padding: 15px;
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
            border-radius: 5px;
            
        }
        .instruction {
            border-left: 5px solid #f5f5dc;
            padding: 15px;
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
            border-radius: 5px;
        }
        .input-container {
            flex: 1;
            border-left: 5px solid #f0ffff;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
            border-radius: 5px;
        }
    }
    

    .loading {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        flex-direction: column;
        gap: 10px;
        padding: 100px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    .instructions {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        flex-direction: column;
        gap: 10px;
        padding: 100px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        max-width: 700px;
        margin: 0 auto;
    }
`

export default Scene