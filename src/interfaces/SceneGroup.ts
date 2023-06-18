export interface SceneGroupType {
    id: string,
    data: {
        name: string,
        scenarios: Array<string>,
        totalAssignedUsers: number
    },
}