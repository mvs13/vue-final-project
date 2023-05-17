<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="result && result.events">
      <ul>
        <li v-for="item in result.events" :key="item.id">
          <div>id: {{ item.id }}</div>
          <div>title: {{ item.title }}</div>
          <div>type: {{ item.events_eventType.title }}</div>
        </li>
      </ul>
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
          id
          events_eventType {
            title
          }
        }
      }
    `);
    return { result, loading, error };
  },
});
</script>
