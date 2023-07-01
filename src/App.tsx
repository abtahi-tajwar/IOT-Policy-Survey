import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import UserIdInput from './components/UserIdInput'
import { getAll, getRemainingScenesForCandidate } from './firebase/scenes'
import { SceneGetType } from './interfaces/SceneType'
import { getResponseScenesOfUser } from './firebase/response'

import './App.css'

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
  const [completedSceneIds, setCompletedSceneIds] = useState<Array<string>>([])
  


  useEffect(() => {
    if (userId) {
      getRemainingScenesForCandidate(userId).then((response : Array<SceneGetType>) => {
        console.log("All scenes", response)
        setScenes(response)
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
      if (!checkIfLastScene(scenes.length, currentSceneIndex)) {
        setCurrentScene(scenes[currentSceneIndex])
      }
    }
  }, [currentSceneIndex])

  // useEffect(() => {
  //   console.log("Changing Scene here", scenes)
  //   if (scenes) {
  //     setCurrentScene(scenes[currentSceneIndex])
  //     checkIfLastScene(scenes.length, currentSceneIndex)
  //   } 
  // }, [currentSceneIndex])

  // // useEffect(() => {
  // //   console.log("At last scene", atLastScene, currentSceneIndex)
  // // }, [atLastScene, currentSceneIndex])

  // useEffect(() => {
  //   if (userId && scenes) {
  //     getResponseScenesOfUser(userId).then(ids => {
  //       console.log("Ids", ids)
  //       if (ids.length > 0) {
  //         if (ids.length === scenes.length) {
  //           setHasUserAlreadyTookTest(true)
  //         } else {
  //           const _scene_index = scenes.findIndex(s => s.id === ids[0]);
            
  //           if (_scene_index !== -1) {
  //             setCurrentSceneIndex(_scene_index + 1)
  //             setCurrentScene(scenes[_scene_index + 1])
  //           }
  //           setHasUserAlreadyTookTest(false)
  //         }
  //       } else {
  //         checkIfLastScene(scenes.length, 0)
  //         setHasUserAlreadyTookTest(false)
  //       }
  //     })
  //   }
  // }, [userId, scenes])

  // const goToNextScene = () => {
  //   if (scenes) {
  //     let sceneIndex = currentSceneIndex + 1
  //     const nextScene = scenes[sceneIndex]

  //     while (sceneIndex !== scenes.length) {
  //       if (!completedSceneIds.includes(nextScene.id)) {
  //         setCurrentSceneIndex(sceneIndex)
  //         break
  //       }
  //       sceneIndex += 1
  //     }  
  //   }
  // }
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
      {userId ? <Scene 
        userId={userId}
        scene={currentScene}
        atLastScene={atLastScene}
        goToNextScene={goToNextScene}
        hasUserAlreadyTookTest={hasUserAlreadyTookTest}
        invalidId={invalidId}
      /> :
      <UserIdInput setUserId={setUserId}/>
    }
    </div>
  )
}


export default App
