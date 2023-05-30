<template>
  <q-card class="event__card" flat bordered>
    <q-card-section horizontal class="q-pa-sm">
      <div class="event__date q-mr-sm">
        <q-icon color="accent" name="fa-solid fa-calendar-day" />
        <span>{{ eventData.start_date }}</span>
      </div>
      <div class="event_time" v-if="eventData.start_time">
        <q-icon color="accent" name="fa-solid fa-clock" />
        <span>{{ eventData.start_time }}</span>
      </div>
    </q-card-section>
    <q-img :src="getImgPath(eventData)" :alt="eventData.title" />
    <q-card-section class="q-pt-xs">
      <div class="event__type__title">
        {{ eventData.events_eventType.title }}
      </div>
    </q-card-section>
    <q-card-section
      horizontal
      class="flex items-center justify-between q-pa-sm"
    >
      <div class="text-h5 q-mt-sm q-mb-xs">
        {{ eventData.title }}
      </div>
      <div class="event__descr" v-if="eventData.descr">
        <q-btn
          color="accent"
          round
          flat
          style="bg-secondary"
          :icon="expanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"
          @click="expandEvent(eventData.id)"
        />
      </div>
    </q-card-section>
    <q-slide-transition>
      <div :id="eventData.id" style="display: none">
        <q-separator />
        <q-card-section class="text-subitle2">
          {{ eventData.descr }}
        </q-card-section>
        <q-separator />
      </div>
    </q-slide-transition>
    <q-card-actions>
      <q-btn
        v-if="eventData.url"
        :href="eventData.url"
        target="_blank"
        flat
        color="secondary"
        class="bg-accent"
        icon="fa-solid fa-arrow-up-right-from-square"
        label="External link"
      />
      <q-btn
        flat
        color="secondary"
        class="bg-accent"
        icon="fa-regular fa-calendar-plus"
        label="Attend"
        @click="eventAttend(eventData.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { useClerkStore } from "stores/clerk";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
// import checkUserEvent from "src/apollo/queryes/countUsersEvent.gql";

export default {
  name: "EventCard",
  props: {
    eventData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    const userID = ref("");
    function setUserID(id) {
      userID.value = id;
    }
    function getUserID() {
      return userID.value;
    }
    const eventID = ref("");
    function setEventID(id) {
      eventID.value = id;
    }
    function getEventID() {
      return eventID.value;
    }

    // const cardQuery = `query CardQuery($userID: String = "") {
    //     userById: users(where: { id: { _eq: $userID } }) {
    //       id
    //       name
    //       last_seen
    //     }
    //   }`;
    // const {
    //   result,
    //   refetch,
    //   onResult: cardQueryResult,
    //   onError: cardQueryError,
    // } = useQuery(gql(cardQuery), () => ({
    //   userID: userID.value,
    // }));

    const isUserEventExistQuery = `query checkUserEvent($user_id: String, $event_id: String) {
      userEvents_aggregate(where: {_and: {event_id: {_eq: $event_id}, user_id: {_eq: $user_id}}}) {
        aggregate {
          count(columns: event_id)
        }
      }
    }`;
    const {
      result: userEventExist,
      refetch: refetchUserEventExist,
      onResult: resultUserEventExist,
    } = useQuery(gql(isUserEventExistQuery), () => ({
      user_id: userID.value,
      event_id: eventID.value,
    }));

    const addUserEventMutation = `mutation InsertUserEvents($user_id: String, $event_id: String) {
      insert_userEvents(objects: {user_id: $user_id, event_id: $event_id}) {
        affected_rows
        returning {
          id
          user_id
          event_id
        }
      }
    }`;
    const { mutate: addUserEvent, onDone: doneAddUserEvent } = useMutation(
      gql(addUserEventMutation),
      () => ({
        variables: {
          user_id: userID.value,
          event_id: eventID.value,
        },
      })
    );

    doneAddUserEvent(() => {
      console.log(
        "Event(" + eventID.value + ") for User(" + userID.value + ") was added"
      );
    });
    return {
      isUserEventExistQuery,
      setEventID,
      getEventID,
      setUserID,
      getUserID,
      addUserEvent,
      doneAddUserEvent,
      userEventExist,
      refetchUserEventExist,
      resultUserEventExist,
    };
  },
  methods: {
    getImgPath(event) {
      return "img/" + (event.kdpv ? event.kdpv : event.events_eventType.image);
    },

    async eventAttend(event_id) {
      const oneClerk = useClerkStore().clerk;
      if (oneClerk.user) {
        this.setUserID(oneClerk.user.id);
        this.setEventID(event_id);
        let answer = await this.isUserEventExist();
        console.log(`exist is ${answer}`);
        if (!(answer > 0)) {
          this.$q.notify({
            message: "You attend this event",
            icon: "fa-solid fa-square-plus",
          });
        } else {
          this.$q.notify({
            message: "You already attend this event",
            icon: "fa-regular fa-square-check",
          });
        }
      } else {
        this.$q.notify({
          message: "You must be signed for ourEvents if you want attend",
          icon: "fa-solid fa-right-to-bracket",
        });
      }
      console.log(` Event(${event_id}) for User(${oneClerk.user.id})`);
    },

    async isUserEventExist() {
      let count = 0;
      // console.log(`isUserEventExist - 1`);

      // this.refetchUserEventExist({
      //   user_id: this.getUserID(),
      //   event_id: this.getEventID(),
      // });
      // console.log(`isUserEventExist - 2`);

      this.resultUserEventExist(async (queryResult) => {
        if (!queryResult.loading) {
          count = await queryResult.data.userEvents_aggregate.aggregate.count;
          console.log(`isUserEventExist - 3(${queryResult.networkStatus})`);

          console.log(`We have ${count} events`);
        }
      });
      // console.log(`isUserEventExist - 4(${res})`);

      return count;

      // this.$apollo
      //   .query({
      //     query: require("../apollo/queryes/countUsersEvent.gql"),
      //     variables: { user_id: this.getUserID(), event_id: this.getEventID() },
      //   })
      //   .then((result) => {
      //     count = result.userEvents_aggregate.aggregate.count;
      //     console.log(`We have ${count} events`);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // getCount().then(() =>
      //   this.resultUserEventExist((queryResult) => {
      //     if (!queryResult.loading) {
      //       console.log(
      //         `We have ${queryResult.data.userEvents_aggregate.aggregate.count} events`
      //       );
      //       if (queryResult.data.userEvents_aggregate.aggregate.count > 0) {
      //         return true;
      //       } else {
      //         return false;
      //       }
      //     }
      //   })
      // );
    },

    expandEvent(event_id) {
      const operateBlock = document.getElementById(event_id);
      if (operateBlock.style.display == "none") {
        operateBlock.style.display = "block";
      } else {
        operateBlock.style.display = "none";
      }
    },
  },
};
</script>

<style lang="scss">
.event__date,
event__time {
  display: flex;
}
</style>
