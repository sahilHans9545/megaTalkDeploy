import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@store/slices/userSlice";
import { chatSlice } from "@store/slices/chatSlice";
import { modalSlice } from "@store/slices/modalSlice";
import { themeSlice } from "@store/slices/themeSlice";
import { notificationSlice } from "@store/slices/notificationSlice";
import { socketSlice } from "@store/slices/socketSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    chatData: chatSlice.reducer,
    modalType: modalSlice.reducer,
    theme: themeSlice.reducer,
    notification: notificationSlice.reducer,
    socket: socketSlice.reducer,
  },
});

export default store;
