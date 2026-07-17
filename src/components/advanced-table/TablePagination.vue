<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetI18nText, type Locale } from "./locales";

type Props = {
  total: number;
  pageSizes?: number[];
  locale?: Locale;
  selectedCount?: number;
};

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  locale: "en",
});

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

const pageNum = defineModel<number>("pageNum", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });

const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => (pageSize.value = Number(val)),
});

const selectedCountLabel = computed(() =>
  props.locale === "zhHans"
    ? `已选：${props.selectedCount ?? 0} 条`
    : `Selected: ${props.selectedCount ?? 0} items`,
);
</script>

<template>
  <div class="pt-4 flex flex-col gap-3 px-2 md:flex-row md:items-center md:justify-between">
    <div
      v-if="props.selectedCount !== undefined"
      class="text-sm font-medium whitespace-nowrap text-muted-foreground"
    >
      {{ selectedCountLabel }}
    </div>
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
        <li class="flex items-center gap-2 mx-2">
          <Select v-model="pageSizeModel">
            <SelectTrigger class="h-9 w-20">
              <SelectValue :placeholder="pageSize.toString()" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem v-for="size in pageSizes" :key="size" :value="size">
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
