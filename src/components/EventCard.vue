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
    const eventID = ref("");

    const cardQuery = `query CardQuery($userID: String = "") {
        userById: users(where: { id: { _eq: $userID } }) {
          id
          name
          last_seen
        }
      }`;
    const {
      result,
      refetch,
      onResult: cardQueryResult,
      onError: cardQueryError,
    } = useQuery(gql(cardQuery), () => ({
      userID: userID.value,
    }));
    function setUserID(id) {
      userID.value = id;
    }

    const isUserEventExistQuery = `query checkUserEvent($user_id: String, $event_id: uuid) {
      userEvents(where: {_and: {event_id: {_eq: $event_id}, user_id: {_eq: $user_id}}}) {
        event_id
        user_id
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

    const addUserEventMutation = `mutation InsertUserEvents($user_id: String, $event_id: uuid) {
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
    function setEventID(id) {
      eventID.value = id;
    }
    doneAddUserEvent(() => {
      console.log(
        "Event(" + eventID.value + ") for User(" + iserID.value + ") was added"
      );
    });
    return {
      setEventID,
      setUserID,
      addUserEvent,
      refetchUserEventExist,
      resultUserEventExist,
    };
  },
  methods: {
    getImgPath(event) {
      return "img/" + (event.kdpv ? event.kdpv : event.events_eventType.image);
    },
    eventAttend(event_id) {
      const oneClerk = useClerkStore().clerk;
      if (oneClerk.user) {
        this.setEventID(event_id);
        this.setUserID(oneClerk.user.id);
        console.log(
          "Event(" + event_id + ") for User(" + oneClerk.user.id + ") was added"
        );
        let exist = this.isUserEventExist(event_id, oneClerk.user.id);
        if (!exist) {
          // this.doneAddUserEvent();
        }
      } else {
        this.$q.notify({
          message: "You must be signed for ourEvents if you want attend",
          icon: "fa-solid fa-right-to-bracket",
        });
      }
      console.log("eventAttend: " + event_id);
    },
    isUserEventExist(event_id, user_id) {
      this.setEventID(event_id);
      this.setUserID(user_id);
      this.refetchUserEventExist();
      this.resultUserEventExist((queryResult) => {
        console.log(queryResult.data);
        console.log(queryResult.loading);
        console.log(queryResult.networkStatus);
        console.log(queryResult.stale);
      });
      return true;
    },
    expandEvent(event_id) {
      const operateBlock = document.getElementById(event_id);
      if (operateBlock.style.display == "none") {
        operateBlock.style.display = "block";
      } else {
        operateBlock.style.display = "none";
      }
      // console.log(
      //   "expandEvent: " + event_id + ", state: " + operateBlock.visible
      // );
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
