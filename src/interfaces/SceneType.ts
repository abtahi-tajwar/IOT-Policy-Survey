export interface SceneGetType {
    id: string,
    data: {
        name: string,
        order: number,
        instruction_markdown: string,
        scenario_markdown: string,
        active: boolean
    },
}