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
  methods: {
    getImgPath(event) {
      return "img/" + (event.kdpv ? event.kdpv : event.events_eventType.image);
    },
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
};
</script>

<style lang="scss">
.event__date,
event__time {
  display: flex;
}
</style>
