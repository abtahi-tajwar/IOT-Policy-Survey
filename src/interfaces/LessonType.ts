export interface LessonsGetType {
    id: string,
    data: {
        name: string,
        type: string,
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