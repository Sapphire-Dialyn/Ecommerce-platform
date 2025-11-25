import { createSlice } from '@reduxjs/toolkit';

interface ChatState {
  isOpen: boolean;
}

const initialState: ChatState = {
  isOpen: false, // Mặc định đóng
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleChat, openChat, closeChat } = chatSlice.actions;
export default chatSlice.reducer;