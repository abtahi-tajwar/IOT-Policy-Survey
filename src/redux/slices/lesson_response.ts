import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface DndBlankType {
  index: number;
  answer: string;
}
interface IntialStateType {
  data: Array<number | string | Array<DndBlankType>>
}
const initialState : IntialStateType = {
  data: []
}
export const lessonResponseSlice = createSlice({
  name: 'lessonResponse',
  initialState,
  reducers: {
    updateResponse: (state, action : PayloadAction<Array<number | string | Array<DndBlankType>>>) => {
      state.data = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateResponse } = lessonResponseSlice.actions

export default lessonResponseSlice.reducer