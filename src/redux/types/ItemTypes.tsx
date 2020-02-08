// Item actions
export const UPDATE_ITEM: string = "UPDATE_ITEM";
export const CREATE_NEW_ITEM: string = "CREATE_NEW_ITEM";
export const DELETE_ITEM: string = "DELETE_ITEM";

export default interface ItemAction {
    type: string
    payload: {
        name: string
        startDate: Date
    }
}