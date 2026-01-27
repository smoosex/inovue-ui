<script setup lang="ts">
const route = useRoute();

const breadcrumbs = computed(() => {
  const matched = route.matched;
  return matched
    .filter((item) => item.meta && item.meta.title)
    .map((item) => ({
      title: String(item.meta.title),
      path: item.path,
    }));
});
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <BreadcrumbItem>
          <RouterLink
            v-if="index < breadcrumbs.length - 1"
            :to="item.path"
            class="flex items-center"
          >
            {{ $t(item.title) }}
          </RouterLink>
          <BreadcrumbPage v-else>
            {{ $t(item.title) }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
