<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";
import { getI18nText, type Locale } from "./locales";

type Props = {
  total: number;
  pageSizes?: number[];
  locale?: Locale;
};

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  locale: "zhHans",
});

const $t = (key: Parameters<typeof getI18nText>[0]) =>
  getI18nText(key, props.locale);

const pageNum = defineModel<number>("pageNum", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });

const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => (pageSize.value = Number(val)),
});
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
        <PaginationFirst>
          <ChevronLeftIcon class="h-4 w-4" />
          <span class="hidden sm:block">{{ $t("first") }}</span>
        </PaginationFirst>
        <PaginationPrevious>
          <ChevronLeftIcon class="h-4 w-4" />
          <span class="hidden sm:block">{{ $t("previous") }}</span>
        </PaginationPrevious>
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
          <Select v-model="pageSizeModel">
            <SelectTrigger class="h-9 w-20">
              <SelectValue :placeholder="pageSize.toString()" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem
                v-for="size in pageSizes"
                :key="size"
                :value="size"
              >
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm font-medium whitespace-nowrap">{{
            $t("perPage")
          }}</span>
          <span class="text-sm font-medium whitespace-nowrap ml-2">
            {{ $t("total") }}
            <span class="text-primary font-bold">{{ total }}</span>
          </span>
        </li>

        <PaginationNext>
          <span class="hidden sm:block">{{ $t("next") }}</span>
          <ChevronRightIcon class="h-4 w-4" />
        </PaginationNext>
        <PaginationLast>
          <span class="hidden sm:block">{{ $t("last") }}</span>
          <ChevronRightIcon class="h-4 w-4" />
        </PaginationLast>
      </PaginationContent>
    </Pagination>
  </div>
</template>
