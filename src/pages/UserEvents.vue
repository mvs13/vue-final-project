<template>
  <q-page padding>
    <h1>{{ title }}</h1>
    <h2>{{ subTitle }}</h2>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "UserEvents",
  setup() {
    const title = "User`s Events";
    const subTitle = "Are you planning to take part in such events";
    return {
      title,
      subTitle,
    };
  },
});
</script>

<style></style>
