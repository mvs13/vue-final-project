<template>
  <q-page padding>
    <h1>Sign In</h1>
    <button id="sign-in-button" onclick="clerkStore.clerk.signOut()">
      SignOut
    </button>
    <div id="signin__block"></div>
    <textarea v-model="message"> </textarea>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useClerkStore } from "stores/clerk";
import Clerk from "@clerk/clerk-js";

const message = ref("");

export default defineComponent({
  name: "SignIn",
  setup() {
    const clerkStore = useClerkStore();
    return { clerkStore };
  },
  mounted() {
    const signinBlock = document.getElementById("signin__block");
    if (clerkStore.clerk.user) {
      message.value = clerkStore.clerk.user;
    } else {
      clerkStore.clerk.openSignIn();
      // clerkStore.clerk.mountSignIn(signinBlock);
    }
    // console.log(signinBlock);
  },
});
</script>

<style></style>
