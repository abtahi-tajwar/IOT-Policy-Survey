import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { LessonsGetType } from "../interfaces/LessonType";
import { DnDResponseType } from '../interfaces/LessonType'
import { convertToFirestoreData } from "./FirebaseHelper";

export interface SubmitLessonResponseArgument {
    candidateId: string, 
    responses : Array<number | string | Array<DnDResponseType>>, 
    lessonId: string, 
    lessonType: string,
    score: number,
    total: number,
    elapsedTime: number
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
                const trainingDocSnap = await getDoc(doc(db, "trainings", trainingId))
                const trainingData = trainingDocSnap.data()
                const q = query(collection(db, "lessons"), where('assignedTrainingIds', 'array-contains', trainingId.trim()))
                const querySnapshot = await getDocs(q)

                const lessons : Array<LessonsGetType> = []
                const orderedLessons : Array<LessonsGetType> = []
                querySnapshot.forEach(item => {
                    const data = item.data()
                    lessons.push({
                        id: item.id,
                        data: {
                            name: data.name,
                            type: data.type,
                            trainingId: trainingId,
                            ...(data.instructions && {
                                instructions: {
                                    description: data.instructions.description,
                                    title: data.instructions.title
                                }
                            }),
                            // instructions: {
                            //     description: data.instructions.description,
                            //     title: data.instructions.title
                            // },
                            questions: data.questions,
                            options: data.options,
                            blanks: data.blanks
                        }
                    })
                })
                if (trainingData) {
                    trainingData.lessonIds.forEach((l_id : string) => {
                        const _lesson = lessons.find(l => l.id === l_id)
                        if (_lesson) {
                            orderedLessons.push(_lesson)
                        } else {
                            throw new Error("All lesson ids are not recorded into the specific data at trainings.lessonIds collection. Please make sure to add all the assigned lesson ids to the array")
                        }
                    })
                    resolve(orderedLessons)
                } else {
                    console.error("Unable to resolve training data which is important order the lesssons")
                    resolve(lessons)
                }
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
                },
                elapsedTime: data.elapsedTime
                
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