<template>
  <NuxtPage />
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const locale = route.params.lang || 'en';
</script>
