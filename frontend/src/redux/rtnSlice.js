import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {

                const existingNotificationIndex = state.likeNotification.findIndex(
                    (item) => item.userId === action.payload.userId && item.postId === action.payload.postId
                );

                if (existingNotificationIndex === -1) {
                    state.likeNotification.push(action.payload);
                }
            } else if (action.payload.type === 'dislike') {

                state.likeNotification = state.likeNotification.filter(
                    (item) => !(item.userId === action.payload.userId && item.postId === action.payload.postId)
                );
            }
        },
        // NEW REDUCER: To clear all notifications
        clearLikeNotifications: (state) => {
            state.likeNotification = [];
        }

    }
});

export const { setLikeNotification, clearLikeNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;