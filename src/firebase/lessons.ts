import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { LessonsGetType } from "../interfaces/LessonType";

export const getLessonsBySceneGroup = (scenarioGroupId: string) => {
    return new Promise(async (resolve : (arg: Array<LessonsGetType>) => void, reject) => {
        const db = getFirestore();
        
        try {
            const scenarioGroupDocSnap = await getDoc(doc(db, "scenario_groups", scenarioGroupId))
            const scenarioGroupData = scenarioGroupDocSnap.data()
            const trainingId = scenarioGroupData?.trainingId ?? null

            if (trainingId) {
                const q = query(collection(db, "lessons"), where('traininigId', '==', trainingId.trim()))
                const querySnapshot = await getDocs(q)

                const lessons : Array<LessonsGetType> = []
                querySnapshot.forEach(item => {
                    const data = item.data()
                    lessons.push({
                        id: item.id,
                        data: {
                            name: data.name,
                            type: data.type,
                            traininigId: data.traininigId,
                            instructions: {
                                description: data.instructions.description,
                                title: data.instructions.title
                            },
                            questions: data.questions
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