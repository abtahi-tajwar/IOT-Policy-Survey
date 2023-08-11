import { QuerySnapshot, doc, collection, getDocs, getFirestore, updateDoc, getDoc } from "firebase/firestore";
import { SceneGroupType } from "../interfaces/SceneGroup";
import app from "./init";

export const getAllSceneGroups = () => {
    return new Promise<Array<SceneGroupType>> (async (resolve, reject) => {
        const groups : Array<SceneGroupType> = []
        const db = getFirestore();
        try {
            const querySnapshot = await getDocs(collection(db, 'scenario_groups'))
            querySnapshot.forEach(doc => {
                groups.push({
                    id: doc.id,
                    data: {
                        name: doc.data().name,
                        scenarios: doc.data().scenarios,
                        totalAssignedUsers: doc.data().totalAssignedUsers
                    }
                })
            })
            resolve(groups)
        } catch (e) {
            reject(e)
        }
    })
}
export const updateSceneGroupTotalUser = (docId: string) => {
    return new Promise (async (resolve : (arg: void) => void, reject) => {
        const db = getFirestore()
        try {
            const docRef = doc(db, "scenario_groups", docId)
            const docSnap = await getDoc(docRef)
            
            await updateDoc(docRef, {
                totalAssignedUsers: docSnap.data() ? docSnap.data()?.totalAssignedUsers + 1 : 1
            })
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}
export const getCandidateSceneGroup = (candidateId: string) => {
    return new Promise (async (resolve : (arg: string) => void, reject) => {
        const db = getFirestore()
        try {
            const docRef = doc(db, "candidates", candidateId)
            const docSnap = await getDoc(docRef)
            const docData = docSnap.data()
            resolve( docData?.assignedGroup ?? null )
        } catch (error) {
            reject(error)
        }
    })
}