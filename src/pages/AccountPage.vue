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
        <q-btn
          color="secondary"
          text-color="accent"
          label="Check User"
          icon="fa-solid fa-user-check"
          @click="checkAction()"
        />
      </q-btn-group>
    </div>
    <div>{{ hello }}</div>
    <div id="account__profile"></div>
  </q-page>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import { useClerkStore } from "stores/clerk";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
// import USER_BY_ID from "../apollo/queryes/UserById";

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

    const userID = ref("");
    const accountQuery = `query AccountQuery($userID: String = "") {
        userById: users(where: { id: { _eq: $userID } }) {
          id
          name
          last_seen
        }
      }`;
    const {
      result,
      refetch,
      onResult: accountQueryResult,
      onError: accountQueryError,
    } = useQuery(gql(accountQuery), () => ({
      userID: userID.value,
    }));
    function setUserId(id) {
      userID.value = id;
    }
    let userById = computed(() => result.value?.userById ?? []);

    const addUserMutation = `mutation InsertUsers($id: String, $name: String) {
      insert_users(objects: {id: $id, name: $name}) {
        affected_rows
        returning {
          id
          name
          last_seen
        }
      }
    }`;
    const userName = ref("");
    const { mutate: addUser, onDone: doneAddUser } = useMutation(
      gql(addUserMutation),
      () => ({
        variables: {
          id: userID.value,
          name: userName.value,
        },
      })
    );
    function setUserName(name) {
      userName.value = name;
    }
    doneAddUser(() => {
      console.log("User was added");
    });
    // console.log(clerkStore.clerk);
    return {
      statusUser,
      userById,
      setUserId,
      refetch,
      accountQueryResult,
      setUserName,
      addUser,
    };
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
      this.checkUserInBase(oneClerk.user);
      // console.log("singinAction");
    },
    singupAction() {
      const oneClerk = useClerkStore().clerk;
      oneClerk.openSignUp();
      this.checkUserInBase(oneClerk.user);
      // console.log("singupAction");
    },
    checkAction() {
      const oneClerk = useClerkStore().clerk;
      if (oneClerk.user) {
        this.checkUserInBase(oneClerk.user);
      } else {
        this.$q.notify({
          message: "Sing In, please",
          icon: "fa-regular fa-square-check",
        });
      }
    },
    checkUserInBase(user) {
      if (user !== null) {
        let userState = "";
        this.setUserId(user.id);
        this.refetch();
        this.accountQueryResult((queryResult) => {
          if (!queryResult.loading) {
            // console.log(queryResult.loading);
            // console.log(queryResult.data.userById.length);
            if (queryResult.data.userById.length > 0) {
              userState = "in table";
            } else {
              if (user.fullName !== null) {
                this.setUserName(user.fullName);
              } else {
                this.setUserName("");
              }
              this.addUser();
              userState = "was added in table";
            }
            this.$q.notify({
              message:
                "User state is: " +
                userState +
                " (" +
                this.userById.length +
                ")",
              icon: "fa-regular fa-square-check",
            });
          }
        });
      }
      // console.log(user.id);
    },
  },
});
</script>

<style></style>
