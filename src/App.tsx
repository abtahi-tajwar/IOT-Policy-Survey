import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import UserIdInput from './components/UserIdInput'
import { getAll } from './firebase/scenes'
import ReactMarkdown from 'react-markdown'
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
  const [hasUserAlreadyTookTest, setHasUserAlreadyTookTest] = useState<boolean | null>(null);
  const [completedSceneIds, setCompletedSceneIds] = useState<Array<string>>([])


  useEffect(() => {
    getAll().then(response => {
      setScenes(response)
      setCurrentScene(response[0])
    })
  }, [])
  useEffect(() => {
    if (scenes) {
      setCurrentScene(scenes[0])

      if (currentSceneIndex === scenes.length - 1) {
        setAtLastScene(true)
      } else { 
        setAtLastScene(false) 
      }
    } 
  }, [currentSceneIndex])
  useEffect(() => {
    if (userId && scenes) {
      getResponseScenesOfUser(userId).then(ids => {
        if (ids.length > 0) {
          if (ids.length === scenes.length) {
            setHasUserAlreadyTookTest(true)
          } else {
            const sc = scenes.find(s => s.id === ids[0])
            if (sc) {
              setCurrentScene(sc)
            }
            setHasUserAlreadyTookTest(false)
          }
        } else {
          setHasUserAlreadyTookTest(false)
        }
      })
      
    }
  }, [userId, scenes])

  const goToNextScene = () => {
    if (scenes) {
      let sceneIndex = currentSceneIndex + 1
      const nextScene = scenes[sceneIndex]

      while (sceneIndex !== scenes.length) {
        if (!completedSceneIds.includes(nextScene.id)) {
          setCurrentSceneIndex(sceneIndex)
          break
        }
        sceneIndex += 1
      }
      
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
      /> :
      <UserIdInput setUserId={setUserId}/>
    }
    </div>
  )
}


export default App
