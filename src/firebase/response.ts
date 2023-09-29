import app from "./init";
import { ResponseType } from "../interfaces/ResponseType";
import { doc, getDoc, setDoc, updateDoc, addDoc, getDocs, collection, query, where, getFirestore } from "firebase/firestore"; 
import { getAll } from "./scenes";

export function create(data: ResponseType) {
    return new Promise<boolean>(async (resolve, reject) => {
        const db = getFirestore(app);
        const responseExists = await checkForExistingUserResponse(data.userId, data.sceneId)
        if (responseExists) {
            resolve(false)
        }
        await addDoc(collection(db, "responses"), data);
        const docRef = doc(db, "candidates", data.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(doc(db, "candidates", data.userId), {
                responses: docSnap.data().responses + 1
            });
        } else {
            await setDoc(doc(db, "candidates", data.userId), {
                id: data.userId,
                responses: 1
            });
        }
        
        // await addDoc(collection(db, "candidates"), { id: data.userId })
        resolve(true)
    })
}
export function getResponseScenesOfUser(userId: string) {
    return new Promise<Array<string>>(async (resolve, reject) => {
        let indexes : Array<string> = []
        const allScenes = await getAll()
        const allUserResponses = await getAllUserResponse(userId)
        console.log("All user responses", allUserResponses)
        allScenes.forEach((scene) => {
            const response = allUserResponses.find(res => res.sceneId === scene.id)
            console.log("Each response", response)
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
export function getAllUserResponse(userId: string) {
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
                sceneName: docData.sceneName,
                answer: docData.answer,
                extraResponse: {
                    allowedScenario: docData.allowedScenario,
                    deniedScenario: docData.deniedScenario
                }
            })
        });
        resolve(responses)
    })
}