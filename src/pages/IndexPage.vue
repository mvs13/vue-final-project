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
          size="60px"
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
    <div v-else-if="eventsList">
      <div class="events__serach__container">
        <q-expansion-item
          icon="fa-solid fa-arrow-up-wide-short"
          expand-icon="fa-solid fa-angles-down"
          expanded-icon="fa-solid fa-angles-up"
          label="Tools"
          caption="filtering, searching and sorting"
        >
          <q-card>
            <q-card-section>
              <q-select
                v-if="eventType"
                clearable
                filled
                v-model="selectedEventType"
                :options="eventType"
                label="Event Type"
                @clear="occuredClear()"
                @update:model-value="occuredUpdate()"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <div>length: {{ eventsListByType.length }}</div>
      <div
        class="events__list__container q-gutter-sm row wrap justify-center items-start content-stretch"
      >
        <EventCard
          v-for="event in eventsListByType.length
            ? eventsListByType
            : eventsList"
          :key="event.id"
          :eventData="event"
          class="col-xs-12 col-sm-6 col-md-4 col-2"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, watch, computed, defineComponent } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import EventCard from "../components/EventCard.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    EventCard,
  },
  setup() {
    let whereCondition = "";
    const selectedType = ref(0);

    let indexQuery = `
      fragment eventFields on events {
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
      query indexPage($selectedType: Int!) {
        byType: events (where: {type_id: {_eq: $selectedType}}) {
          ...eventFields
        }
        all: events {
          ...eventFields
        }
        eventType(order_by: { title: asc }) {
          value: id
          label: title
        }
      }
    `;
    let { result, loading, error, refetch } = useQuery(
      gql(indexQuery),
      () => ({ selectedType: selectedType.value }),
      {
        fetchPolicy: "no-cache",
      }
    );

    function selectType(type) {
      selectedType.value = type;
    }

    let eventType = computed(() => result.value?.eventType ?? []);
    let eventsList = computed(() => result.value?.all ?? []);
    let eventsListByType = computed(() => result.value?.byType ?? []);

    watch(() => {
      // console.log(result);
      // console.log(eventType);
      // console.log(eventsList);
      // console.log(loading);
      // console.log(error);
    });
    return {
      pageTitle: "We are glad to offer you",
      whereCondition,
      indexQuery,
      loading,
      error,
      refetch,
      eventsList,
      eventsListByType,
      selectType,
      selectedType,
      selectedEventType: ref(null),
      eventType,
    };
  },
  methods: {
    occuredClear() {
      // this.whereCondition = "";
      // this.refetch();
      // console.log("occuredClear: " + this.whereCondition);
    },
    occuredUpdate() {
      if (this.selectedEventType === null) {
        this.selectType(0);
      } else {
        this.selectType(this.selectedEventType.value);
      }
      this.refetch();
      // console.log("occuredUpdate: " + this.indexQuery);
    },
  },
});
</script>

<style lang="scss">
.events__serach__container {
  margin-bottom: 24px;
}

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
