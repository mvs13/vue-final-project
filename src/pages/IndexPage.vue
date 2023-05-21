<template>
  <q-page padding>
    <h2>
      {{ pageTitle }}
    </h2>
    <div v-if="loading" class="row">
      <div class="col-6">Loading...</div>
      <div class="col-6">
        <q-circular-progress
          indeterminate
          size="90px"
          :thickness="0.2"
          color="secondary"
          center-color="primary"
          track-color="transparent"
          class="q-ma-md"
        />
      </div>
    </div>
    <div v-else-if="error" class="row">
      <div class="col-6">Error: {{ error.message }}</div>
    </div>
    <div
      v-else-if="result && result.events"
      class="event__card__row q-gutter-sm row wrap justify-center items-start content-stretch"
    >
      <div
        v-for="item in result.events"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4 col-2"
      >
        <q-card class="event__card" flat bordered>
          <q-card-section horizontal class="q-pa-sm">
            <div class="event__date q-mr-sm">
              <q-icon color="accent" name="fa-solid fa-calendar-day" />
              {{ item.start_date }}
            </div>
            <div class="event_time" v-if="item.start_time">
              <q-icon color="accent" name="fa-solid fa-clock" />
              {{ item.start_time }}
            </div>
          </q-card-section>
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-card-section class="q-pt-xs">
            <div class="event__type__title">
              {{ item.events_eventType.title }}
            </div>
          </q-card-section>
          <q-card-section
            horizontal
            class="flex items-center justify-between q-pa-sm"
          >
            <div class="text-h5 q-mt-sm q-mb-xs">
              {{ item.title }}
            </div>
            <div class="event__descr" v-if="item.descr">
              <q-btn
                color="accent"
                round
                flat
                style="bg-secondary"
                :icon="
                  expanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'
                "
                @click="expandEvent(item.id)"
              />
            </div>
          </q-card-section>
          <q-slide-transition>
            <div :id="item.id" style="display: none">
              <q-separator />
              <q-card-section class="text-subitle2">
                {{ item.descr }}
              </q-card-section>
              <q-separator />
            </div>
          </q-slide-transition>
          <q-card-actions>
            <q-btn
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
              @click="eventAttend(item.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const { result, loading, error } = useQuery(gql`
      query eventsList {
        events {
          title
          id
          events_eventType {
            title
            image
          }
          kdpv
          start_date
          start_time
          url
          descr
        }
      }
    `);
    return {
      pageTitle: "We are glad to offer you",
      result,
      loading,
      error,
      expanded: ref([]),
    };
  },
  methods: {
    eventAttend(event_id) {
      console.log("eventAttend: " + event_id);
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
});
</script>

<style lang="scss">
.event__card__row {
  min-height: 250px;
}
.event__card {
  background-color: $primary;
}
.event__type__title {
  color: white;
}
</style>
