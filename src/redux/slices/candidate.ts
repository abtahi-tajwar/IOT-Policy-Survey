import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CandidateLessonResponseType, LessonsGetType } from '../../interfaces/LessonType'
import { getLessonsBySceneGroup } from '../../firebase/lessons'
import { getCompletedLessons } from '../../firebase/candidates'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'

interface IntialStateType {
  id: string | null
}
const initialState : IntialStateType = {
  id: null
}

export const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    updateCandidateId: (state, action : PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateCandidateId } = candidateSlice.actions

export default candidateSlice.reducer