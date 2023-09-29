import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import UserIdInput from './components/UserIdInput'
import { getAll, getRemainingScenesForCandidate } from './firebase/scenes'
import { SceneGetType } from './interfaces/SceneType'
import { getResponseScenesOfUser } from './firebase/response'

import './App.css'
import { getCandidateSceneGroup } from './firebase/scene_groups'
import { getLessonsBySceneGroup } from './firebase/lessons'
import { LessonsGetType } from './interfaces/LessonType'
import Loader from './components/Loader'
import Training from './components/Training/Training'
import { useAppDispatch } from './redux/hooks'
import { getLessons } from './redux/slices/lesson'

function App() {
  const queryParams = new URLSearchParams(window.location.search)
  const userIdParam = queryParams.get("userId")
  const [userId, setUserId] = useState<string | null>(userIdParam)
  const [scenes, setScenes] = useState<Array<SceneGetType>>();
  const [currentScene, setCurrentScene] = useState<SceneGetType | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [atLastScene, setAtLastScene] = useState<boolean>(true);
  const [hasUserAlreadyTookTest, setHasUserAlreadyTookTest] = useState<boolean | null>(false);
  const [invalidId, setInvalidId] = useState<boolean>(false)
  const [lessonsLoading, setLessonsLoading] = useState<boolean>(true)
  const [lessons, setLessons] = useState<Array<LessonsGetType> | null>(null)
  const [navigateToLesson, setNavigateToLesson] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (userId) {
      setLessonsLoading(true)
      // Fetching lessons after getting userId
      getCandidateSceneGroup(userId).then((scenarioGroupId : string) => { // Fetching candidate scene group which determines the training id
        dispatch(getLessons(scenarioGroupId)).then(res => {
          setLessonsLoading(false)
        })
        getLessonsBySceneGroup(scenarioGroupId).then(res => { // Fetching all the lessons relevent to that training Id
          setLessonsLoading(false)
          setLessons(res)
        })
      })
      getRemainingScenesForCandidate(userId).then((response : Array<SceneGetType>) => {
        console.log("All scenes", response)
        setScenes(response)
        checkIfLastScene(response.length, currentSceneIndex)
        if (response.length === 0) {
          setHasUserAlreadyTookTest(true)
        } else {
          setCurrentScene(response[currentSceneIndex])
        }
      }).catch(e => {
        console.log(e, userId)
        setInvalidId(true)
      })
    }
  }, [userId])

  useEffect(() => {
    if (scenes) {
      console.log("Current scene index", currentSceneIndex, scenes[currentSceneIndex])
      checkIfLastScene(scenes.length, currentSceneIndex)
      setCurrentScene(scenes[currentSceneIndex])
    }
  }, [currentSceneIndex])

  const goToNextScene = () => {
    setCurrentSceneIndex(prevState => prevState + 1)
  }
  const checkIfLastScene = (totalScenes: number, currentSceneIndex: number) => {
    if (currentSceneIndex === totalScenes - 1) {
      setAtLastScene(true)
      return true
    } else { 
      setAtLastScene(false) 
      return false
    }
  }
  
  return (
    <div className="App">
      {userId ? (
        <Loader isLoading={lessonsLoading}>
          {!lessonsLoading &&
            (!navigateToLesson ? <Scene 
              userId={userId}
              scene={currentScene}
              atLastScene={atLastScene}
              goToNextScene={goToNextScene}
              hasUserAlreadyTookTest={hasUserAlreadyTookTest}
              invalidId={invalidId}
            /> : <Training candidateId={userId} setNavigateToLesson={setNavigateToLesson} />)
          }
        </Loader>
       ) :
      <UserIdInput setUserId={setUserId}/>
    }
    </div>
  )
}


export default App
