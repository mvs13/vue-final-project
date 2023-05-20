<template>
  <q-page padding>
    <h3>User's personal account</h3>
    <div class="account__status">{{ statusUser }}</div>
    <div class="q-pa-md">
      <q-btn-group spread>
        <q-btn
          color="secondary"
          text-color="accent"
          label="Sing In"
          icon="fa-solid fa-right-to-bracket"
          @click="singinAction()"
        />
        <q-btn
          color="secondary"
          text-color="accent"
          label="Sing Out"
          icon="fa-solid fa-right-from-bracket"
          @click="singoutAction()"
        />
        <q-btn
          color="secondary"
          text-color="accent"
          label="Sing Up"
          icon="fa-solid fa-user-plus"
          @click="singupAction()"
        />
      </q-btn-group>
    </div>
    <div id="account__profile"></div>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useClerkStore } from "stores/clerk";

export default defineComponent({
  name: "AccountPage",
  setup() {
    const clerkStore = useClerkStore();
    let statusUser = "";
    if (clerkStore.user) {
      statusUser = "Signed In";
    } else {
      statusUser = "Signed Out";
    }
    // console.log(clerkStore.clerk);
    return { statusUser };
  },
  methods: {
    singoutAction() {
      const oneClerk = useClerkStore().clerk;
      if (!oneClerk.user) {
        this.$q.notify({
          message: "Already Out",
          icon: "fa-regular fa-square-check",
        });
      } else {
        oneClerk.signOut();
      }
      // oneClerk.clerk.signOut();
      // console.log(oneClerk.isReady());
    },
    singinAction() {
      const oneClerk = useClerkStore().clerk;
      if (oneClerk.user) {
        this.$q.notify({
          message: "Already In",
          icon: "fa-regular fa-square-check",
        });
        const profileBlock = document.getElementById("account__profile");
        oneClerk.mountUserProfile(profileBlock);
      } else {
        oneClerk.openSignIn();
      }
      console.log("singinAction");
    },
    singupAction() {
      console.log("singupAction");
    },
  },
});
</script>

<style></style>
