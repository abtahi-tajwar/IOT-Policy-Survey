export interface ResponseType {
    userId: string,
    timeRequired: number,
    sceneId: string,
    sceneName: string,
    answer: string,
    extraResponse: {
        allowedScenario: string,
        deniedScenario: string
    }
    
}
export interface ResponseStatusType {
    status: "not_submitted" | "loading" | "successful" | "failed",
    message: string
}