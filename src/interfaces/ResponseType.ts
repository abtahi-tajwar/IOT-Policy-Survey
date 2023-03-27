export interface ResponseType {
    userId: string,
    timeRequired: number,
    sceneId: string,
    answer: string
}
export interface ResponseStatusType {
    status: "not_submitted" | "loading" | "successful" | "failed",
    message: string
}