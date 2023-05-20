import { defineStore } from "pinia";

export const useClerkStore = defineStore("clerk", {
  state: () => ({
    counter: 0,
    clerkFrontendApi: "ultimate-shrew-53.clerk.accounts.dev",
    publishableKey:
      "pk_test_dWx0aW1hdGUtc2hyZXctNTMuY2xlcmsuYWNjb3VudHMuZGV2JA",
    clerk: {},
  }),

  getters: {
    getFrontendAPI(state) {
      return state.clerkFrontendApi;
    },
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});
