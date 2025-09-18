<template>
	<main id="main" class="home">
		<MDC :value="home.content" />
	</main>

</template>

<script setup>

import { useRoute } from 'vue-router';

const route = useRoute();
// Assume locale is the first path segment, e.g. /en/
const locale = route.path.split('/')[1] || 'en';
const contentPath = `/pages/${locale}/home`;

const { data: home } = reactive(await useAsyncData("home", () =>
	queryContent(contentPath).findOne())
);

// setSeoHead(home.SEOmetaData);

</script>

<style lang="scss" scoped>
main {
	display: grid;
	justify-items: center;
	align-items: center;
	:deep(div) {
		max-width: 50em;
	}
	// assets/scss/mixins
	@include fade-in;
}
</style>
