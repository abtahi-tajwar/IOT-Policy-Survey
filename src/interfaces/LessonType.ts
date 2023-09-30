export interface LessonsGetType {
    id: string,
    data: (MCQLessonDataType & DnDLessonDataType)
}
interface MCQLessonDataType {
    name: string,
    type: ('mcq'|'dnd'|'demographics'|'attention_check'),
    trainingId: string,
    image: string,
    instructions?: {
        description: string,
        title: string
    },
    questions: [
        {
            question: string,
            answer: {
                explanation: string,
                index: number
            },
            image: string,
            options: Array<string>
        }
    ]
}
interface DnDLessonDataType {
    name: string,
    type: ('mcq'|'dnd'|'demographics'|'attention_check'),
    trainingId: string,
    image: string,
    instructions: {
        description: string,
        title: string
    },
    options: Array<string>,
    blanks: [
        {
            answers: Array<string>,
            question: Array<string>,
            explanation?: string 
        }
    ]
}
export interface MCQLessonsGetType {
    id: string,
    data: {
        name: string,
        type: ('mcq'|'dnd'),
        traininigId: string,
        instructions: {
            description: string,
            title: string
        },
        questions: [
            {
                question: string,
                answer: number,
                image: string,
                options: Array<string>
            }
        ]
    }
} 
export interface DnDLessonsGetType {
    id: string,
    data: {
        name: string,
        type: ('mcq'|'dnd'),
        traininigId: string,
        instructions: {
            description: string,
            title: string
        },
        options: Array<string>,
        blanks: [
            {
              answers: Array<string>,
              question: Array<string>  
            }
        ]
    }
}
export interface DnDResponseType {
    index: number,
    answer: string
}
export interface CandidateLessonResponseType {
    id: string,
    data: {
        lesson: {
            id: string,
            type: string
        },
        responses: Array<Array<DnDResponseType> | number>,
        score: number,
        total: number
    }
}