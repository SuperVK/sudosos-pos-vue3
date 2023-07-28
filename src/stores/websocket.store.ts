// Pinia Store Template

import { defineStore } from 'pinia';

interface SettingsState {
  isConnected: boolean;
  connecting: boolean;
}

export const useWebSocketStore = defineStore('webSocket', {
  state: (): SettingsState => ({
    isConnected: false,
    connecting: false,
  }),
  getters: {
  },
  actions: {
    setConnected(status: boolean) {
      this.isConnected = status;
    },
    setConnecting(status: boolean) {
      this.connecting = status;
    },
  },
});
