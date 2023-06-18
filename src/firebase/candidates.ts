import app from "./init";
import { doc, collection, addDoc, getFirestore, getDoc, DocumentSnapshot } from "firebase/firestore";
import { DocumentReference, DocumentData } from "firebase/firestore";
import { getAllSceneGroups, updateSceneGroupTotalUser } from "./scene_groups";
import { SceneGroupType } from "../interfaces/SceneGroup";
import { selectLowestRandomIndex } from "../utils/helpers";

export const createNewCandidate = () => {
    return new Promise(async (
            resolve: (arg: DocumentReference<DocumentData>) => void, 
            reject
        ) => {
        const db = getFirestore();
        try {
            const sceneGroups : Array<SceneGroupType> = await getAllSceneGroups()
            const randomSceneIndex = selectLowestRandomIndex(sceneGroups.map(sg => sg.data.totalAssignedUsers))
            const docRef : DocumentReference<DocumentData> = await addDoc(collection(db, "candidates"), {
                responses: 0,
                completionToken: "",
                surveyCompleted: false,
                assignedGroup: sceneGroups[randomSceneIndex].id
            });
            await updateSceneGroupTotalUser(sceneGroups[randomSceneIndex].id)
            resolve(docRef)
        } catch (e) {
            reject(e)
        }
    }) 
}

export const getCandidate = (candidateId: string) => {
    return new Promise(async (resolve : (arg: DocumentSnapshot<DocumentData>) => void, reject) => {
        const db = getFirestore();
        try {
            const docRef = doc(db, "candidates", candidateId)
            const docSnap = await getDoc(docRef)

            return resolve(docSnap)
        } catch (e) {
            reject(e)
        }
    })
}