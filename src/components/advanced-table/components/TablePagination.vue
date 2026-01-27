<script setup lang="ts">
type Props = {
  total: number;
  pageSizes?: number[];
};

withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
});

const pageNum = defineModel<number>("pageNum", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });
</script>

<template>
  <div class="pt-4 flex items-center justify-end gap-4 px-2">
    <Pagination
      v-model:page="pageNum"
      :total="total"
      :sibling-count="1"
      show-edges
      :default-page-size="pageSize"
      :items-per-page="pageSize"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationFirst />
        <PaginationPrevious />
        <template v-for="(item, index) in items">
          <PaginationItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            :is-active="item.value === pageNum"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <!-- Page Size Selector -->
        <li class="flex items-center gap-2 mx-2">
          <Select
            :model-value="pageSize.toString()"
            @update:model-value="(v: string) => (pageSize = Number(v))"
          >
            <SelectTrigger class="h-9 w-20">
              <SelectValue :placeholder="pageSize.toString()" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem
                v-for="size in pageSizes"
                :key="size"
                :value="size.toString()"
              >
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm font-medium whitespace-nowrap">{{
            "/ page"
          }}</span>
          <span class="text-sm font-medium whitespace-nowrap ml-2">
            Total: <span class="text-primary font-bold">{{ total }}</span>
          </span>
        </li>

        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>
  </div>
</template>
