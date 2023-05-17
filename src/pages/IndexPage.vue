<template>
  <q-page padding class="flex flex-center">
    <h2>
      {{ pageTitle }}
    </h2>
    <div v-if="loading">
      Loading...
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
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="result && result.events">
      <q-card
        class="event__card"
        flat
        bordered
        v-for="item in result.events"
        :key="item.id"
      >
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="event__type__title">
              {{ item.events_eventType.title }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs">
              {{ item.title }}
            </div>
            <div class="text-caption text-grey">
              {{ item.descr }}
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-icon color="secondary" name="fa-solid fa-calendar-day" />
          <q-icon
            color="secondary"
            name="fa-solid fa-arrow-up-right-from-square"
          />
          <q-btn flat round icon="event" />

          <q-btn flat> {{ item.start_date }} </q-btn>
          <q-btn flat> {{ item.start_time }} </q-btn>
          <q-btn flat color="primary"> Reserve </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const { result, loading, error } = useQuery(gql`
      query eventsList {
        events {
          title
          start_date
          start_time
          url
          descr
          events_eventType {
            title
          }
        }
      }
    `);
    return {
      pageTitle: "We are glad to offer you",
      result,
      loading,
      error,
    };
  },
});
</script>

<style lang="scss">
.event__card {
  background-color: $primary;
}
.event__type__title {
}
</style>
