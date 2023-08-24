import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { LessonsGetType } from "../interfaces/LessonType";
import { DnDResponseType } from '../interfaces/LessonType'
import { convertToFirestoreData } from "./FirebaseHelper";

export interface SubmitLessonResponseArgument {
    candidateId: string, 
    responses : Array<number | Array<DnDResponseType>>, 
    lessonId: string, 
    lessonType: string,
    score: number,
    total: number
}
export interface DnDResponseFirebaseType {
    _: Array<DnDResponseType>
}
export const getLessonsBySceneGroup = (scenarioGroupId: string) => {
    return new Promise(async (resolve : (arg: Array<LessonsGetType>) => void, reject) => {
        const db = getFirestore();
        
        try {
            const scenarioGroupDocSnap = await getDoc(doc(db, "scenario_groups", scenarioGroupId))
            const scenarioGroupData = scenarioGroupDocSnap.data()
            const trainingId = scenarioGroupData?.trainingId ?? null

            if (trainingId) {
                console.log("Training Id for lesson", trainingId)
                const q = query(collection(db, "lessons"), where('trainingId', '==', trainingId.trim()))
                const querySnapshot = await getDocs(q)
                console.log("lessons query snapshot", querySnapshot)

                const lessons : Array<LessonsGetType> = []
                querySnapshot.forEach(item => {
                    const data = item.data()
                    lessons.push({
                        id: item.id,
                        data: {
                            name: data.name,
                            type: data.type,
                            trainingId: data.trainingId,
                            instructions: {
                                description: data.instructions.description,
                                title: data.instructions.title
                            },
                            questions: data.questions,
                            options: data.options,
                            blanks: data.blanks
                        }
                    })
                })
                resolve(lessons)
            } else {
                resolve([])
            } 
        } catch (error) {
            reject(error)
        }
    })
}
export const submitLessonResponse = (data : SubmitLessonResponseArgument) => {
    return new Promise(async (resolve : (arg: void) => void, reject) => {
        const db = getFirestore();
        try {
            await addDoc(collection(db, 'lessson_responses'), {
                candidateId: data.candidateId,
                score: data.score,
                total: data.total,
                responses: convertToFirestoreData(data.responses),
                lesson: {
                    id: data.lessonId,
                    type: data.lessonType
                }
                
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
const formatFirebaseTypeResposne = (data : Array<number | Array<DnDResponseType>>) : Array<number | DnDResponseFirebaseType> => {
    return data.map(answer => {
        if (typeof answer === 'number') {
            return answer
        }
        return {
            _: answer
        }
    })
}