import app from "./init";
import { doc, collection, addDoc, getFirestore, getDoc, DocumentSnapshot, query, where, updateDoc } from "firebase/firestore";
import { DocumentReference, DocumentData } from "firebase/firestore";
import { getAllSceneGroups, updateSceneGroupTotalUser } from "./scene_groups";
import { SceneGroupType } from "../interfaces/SceneGroup";
import { generateRandomString, selectLowestRandomIndex } from "../utils/helpers";

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
export const generateCandidateCompletionToken = (candidateId: string) => {
    return new Promise(async (resolve : (arg: string) => void, reject) => {
        const db = getFirestore();
        try {
            const docRef = doc(db, "candidates", candidateId)
            const docSnap = await getDoc(docRef)
            const candidateData = docSnap.data()
            if (!candidateData) {
                reject("Wrong candidate ID")
            } else {
                if (!candidateData.surveyCompleted) {
                    const token: string = `${generateRandomString(22)}${candidateId}${generateRandomString(22)}`
                    await updateDoc(docRef, {
                        completionToken: token,
                        surveyCompleted: true
                    })
                    resolve(token);
                } else {
                    resolve(candidateData.completionToken)
                }
            }
            
        } catch (e) {
            reject(e)
        }
    })
}