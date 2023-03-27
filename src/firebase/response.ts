import app from "./init";
import { ResponseType } from "../interfaces/ResponseType";
import { doc, getDoc, setDoc, getDocs, collection, query, where, getFirestore } from "firebase/firestore"; 
import { getAll } from "./scenes";

export function create(data: ResponseType) {
    return new Promise<boolean>(async (resolve, reject) => {
        const db = getFirestore(app);
        const responseExists = await checkForExistingUserResponse(data.userId, data.sceneId)
        if (responseExists) {
            resolve(false)
        }
        await setDoc(doc(db, "responses", data.userId), data);
        resolve(true)
    })
}
export function getResponseScenesOfUser(userId: string) {
    return new Promise<Array<string>>(async (resolve, reject) => {
        let indexes : Array<string> = []
        const allScenes = await getAll()
        const allUserResponses = await getAllUserResponse(userId)

        allScenes.forEach((scene) => {
            const response = allUserResponses.find(res => res.sceneId === scene.id)
            if (response) {
                indexes.push(scene.id)
            }
        })
        resolve(indexes)
    })
}
function checkForExistingUserResponse(userId: string, sceneId: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        const db = getFirestore(app);

        const q = query(collection(db, "responses"), where("userId", "==", userId), where("sceneId", "==", sceneId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}
function getAllUserResponse(userId: string) {
    return new Promise<Array<ResponseType>>(async (resolve, reject) => {
        const db = getFirestore(app);

        const q = query(collection(db, "responses"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const responses : Array<ResponseType> = []
        querySnapshot.forEach((doc) => {
            const docData = doc.data()
            // doc.data() is never undefined for query doc snapshots
            responses.push({
                userId: docData.userId,
                timeRequired: docData.timeRequired,
                sceneId: docData.sceneId,
                answer: docData.answer
            })
        });
        resolve(responses)
    })
}