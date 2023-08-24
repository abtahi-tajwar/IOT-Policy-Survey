import app from "./init";
import { doc, collection, addDoc, getFirestore, getDoc, DocumentSnapshot, query, where, updateDoc, getDocs } from "firebase/firestore";
import { DocumentReference, DocumentData } from "firebase/firestore";
import { getAllSceneGroups, updateSceneGroupTotalUser } from "./scene_groups";
import { SceneGroupType } from "../interfaces/SceneGroup";
import { generateRandomString, selectLowestRandomIndex } from "../utils/helpers";
import { CandidateLessonResponseType } from "../interfaces/LessonType";
import { convertFromFirestoreData } from "./FirebaseHelper";

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
                    const token: string = `${generateRandomString(6)}${candidateId}${generateRandomString(6)}`
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
export const getCompletedLessons = (candidateId: string) => {
    return new Promise(async (resolve : (arg: Array<CandidateLessonResponseType>) => void, reject) => {
        const db = getFirestore();
        try {
            const lessonResponses : Array<CandidateLessonResponseType> = []
            const q = query(collection(db, "lessson_responses"), where("candidateId", '==', candidateId))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(lr => {
                lessonResponses.push({
                    id: lr.id,
                    data: {
                        lesson: {
                            id: lr.data().lesson.id,
                            type: lr.data().lesson.type
                        },
                        responses: convertFromFirestoreData(lr.data().responses),
                        score: lr.data().score,
                        total: lr.data().total
                    }
                })
            })
            resolve(lessonResponses)
        } catch (error) {
            reject(error)
        }
    })
}
export const getCandidateLessonResponse = (candidateId: string, lessonId: string) => {
    
    return new Promise (async (resolve : (arg: CandidateLessonResponseType) => void, reject) => {
        const db = getFirestore();
        try {
            const q = query(
                collection(db, "lessson_responses"), 
                where("candidateId", '==', candidateId), 
                where("lesson.id", "==", lessonId))
            const querySnapshot = await getDocs(q)
            const candidateResponses : Array<CandidateLessonResponseType> = []
            querySnapshot.forEach(doc => {
                candidateResponses.push({
                    id: doc.id,
                    data: {
                        lesson: {
                            id: doc.data().lesson.id,
                            type: doc.data().lesson.type
                        },
                        responses: convertFromFirestoreData(doc.data().responses),
                        score: doc.data().score,
                        total: doc.data().total
                    }
                })
            })
            resolve(candidateResponses[0])
        } catch (error) {
            reject(error)
        }
    })
}