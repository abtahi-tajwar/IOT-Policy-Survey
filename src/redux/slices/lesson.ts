import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CandidateLessonResponseType, LessonsGetType } from '../../interfaces/LessonType'
import { getLessonsBySceneGroup } from '../../firebase/lessons'
import { getCompletedLessons } from '../../firebase/candidates'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'

interface IntialStateType {
  lessons: Array<LessonsGetType>,
  currentLesson: null | LessonsGetType,
  currentLessonIndex: null | number,
  lessonResponses: null | Array<CandidateLessonResponseType>,
  lessonNavigationIndex: number,
  loading: {
    getLessons: boolean,
    getLessonResponse: boolean,
    updateCurrentLesson: boolean,
    initializeNavigationIndex: boolean
  },
  error: any
}
const initialState : IntialStateType = {
  lessons: [],
  lessonResponses: null,
  currentLesson: null,
  currentLessonIndex: null,
  lessonNavigationIndex: 0,
  loading: {
    getLessons: false,
    getLessonResponse: false,
    updateCurrentLesson: false,
    initializeNavigationIndex: true
  },
  error: null
}

export const getLessons = createAsyncThunk(
    "get/lessons",
    async (scenarioGroupId : string, thunkAPI) => {
        try {
            const lessons : Array<LessonsGetType> = await getLessonsBySceneGroup(scenarioGroupId)
            return lessons
        } catch (error) {
            return thunkAPI.rejectWithValue({ error })
        }
        
    }
)
export const getLessonResponse = createAsyncThunk(
    'get/lesson/response',
    async (candidateId: string, thunkAPI : any) => {
        try {
            const completedLessonsResponse = await getCompletedLessons(candidateId)
            return completedLessonsResponse
        } catch (error) {
            return thunkAPI.rejectWithValue({ error })
        }
    }
)
export const updateCurrentLesson = createAsyncThunk(
    "update/current/lesson",
    async (_, thunkAPI : any) => {
        const lessonResponses = thunkAPI.getState().lesson.lessonResponses
        const lessons = thunkAPI.getState().lesson.lessons
        if (lessonResponses) {
            return {
                currentLesson: lessons.find((l : LessonsGetType) => !lessonResponses.find((cl : CandidateLessonResponseType) => cl.data.lesson.id === l.id)),
                currentLessonIndex: lessons.findIndex((l : LessonsGetType) => !lessonResponses.find((cl : CandidateLessonResponseType)  => cl.data.lesson.id === l.id)),
            }
        } else {
            return thunkAPI.rejectWithValue({ error : 'Please Initialize Lesson Responses First' })
        }
        
    }
)
export const initializeNavigationIndex = createAsyncThunk(
  "navigationIndex/initialize",
  async (_, thunkAPI : any) => {
      const lessonResponses = thunkAPI.getState().lesson.lessonResponses
      const lessons = thunkAPI.getState().lesson.lessons
      if (lessonResponses) {
          return lessons.findIndex((l : LessonsGetType) => !lessonResponses.find((cl : CandidateLessonResponseType)  => cl.data.lesson.id === l.id))
      } else {
          return thunkAPI.rejectWithValue({ error : 'Please Initialize Lesson Responses First' })
      }
      
  }
)

export const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    updateLessons: (state, action : PayloadAction<Array<LessonsGetType>>) => {
      state.lessons = action.payload
    },
    updateLessonNavigationIndex: (state, action : PayloadAction<number>) => {
      state.lessonNavigationIndex = action.payload
    },
    navigateToNextLesson: (state) => {
      state.lessonNavigationIndex += 1
    }
  },
  extraReducers: builder => {
    builder
      // GET Lessons
      .addCase(getLessons.pending, state => {
        state.loading.getLessons = true
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.loading.getLessons = false
        state.lessons = action.payload
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.loading.getLessons = false
        state.error = action.error
      })
      // Get Lesson Responses
      .addCase(getLessonResponse.pending, state => {
        state.loading.getLessonResponse = true
      })
      .addCase(getLessonResponse.fulfilled, (state, action) => {
        state.lessonResponses = action.payload
        state.loading.getLessonResponse = false
      })
      .addCase(getLessonResponse.rejected, (state, action) => {
        state.error = action.error
      })
      // Get Current Lesson
      .addCase(updateCurrentLesson.pending, state => {
        state.loading.updateCurrentLesson = true
      })
      .addCase(updateCurrentLesson.fulfilled, (state, action) => {
        state.currentLesson = action.payload.currentLesson
        state.currentLessonIndex = action.payload.currentLessonIndex
        state.loading.updateCurrentLesson = false
      })
      .addCase(updateCurrentLesson.rejected, (state, action) => {
        state.error = action.error
      })
      // Initialize Navigation Index
      .addCase(initializeNavigationIndex.pending, state => {
        state.loading.initializeNavigationIndex = true
      })
      .addCase(initializeNavigationIndex.fulfilled, (state, action) => {
        state.lessonNavigationIndex = action.payload
        state.loading.initializeNavigationIndex = false
      })
      .addCase(initializeNavigationIndex.rejected, (state, action) => {
        state.error = action.error
      })
    }
})

// Action creators are generated for each case reducer function
export const { updateLessons, updateLessonNavigationIndex, navigateToNextLesson } = lessonSlice.actions

export default lessonSlice.reducer