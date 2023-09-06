import { configureStore } from '@reduxjs/toolkit'
import lessonResponse from './slices/lesson_response'
import lesson from './slices/lesson'
import candidate from './slices/candidate'

const store = configureStore({
    reducer: {
        lessonResponse: lessonResponse,
        lesson: lesson,
        candidate: candidate
      },
  })
  
export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch