<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Search, X } from "lucide-vue-next";
import type {
  FilterOption,
  FilterValue,
  FilterInputType,
  AnyFilterValue,
  ActiveFilterItem,
  ActiveFilterRemoveEvent,
} from "./types";
import { getI18nText, type Locale } from "./locales";
import FilterInput from "./FilterInput.vue";
import FilterSelect from "./FilterSelect.vue";
import FilterMultiSelect from "./FilterMultiSelect.vue";
import FilterTreeSelect from "./FilterTreeSelect.vue";
import FilterCascadeSelect from "./FilterCascadeSelect.vue";
import { DateTimeRangePicker } from "@/components/date-time-range-picker";

const props = defineProps<{
  options: FilterOption[];
  locale?: Locale;
}>();

const activeFilters = defineModel<ActiveFilterItem[]>("activeFilters");

const emit = defineEmits<{
  (e: "search", value: FilterValue): void;
  (e: "loadMore", filterKey: string): void;
  (e: "loadChildren", parentId: string): void;
  (e: "removeFilter", value: ActiveFilterRemoveEvent): void;
  (e: "clearAllFilters"): void;
}>();

const locale = computed(() => props.locale || "en");
const $t = (key: Parameters<typeof getI18nText>[0]) =>
  getI18nText(key, locale.value);

const selectedKey = ref(props.options[0]?.value || "");
const currentOption = computed(() =>
  props.options.find((o) => o.value === selectedKey.value)
);

const resolveComponent = (type?: FilterInputType) => {
  switch (type) {
    case "select":
      return FilterSelect;
    case "multi-select":
      return FilterMultiSelect;
    case "tree-multi-select":
      return FilterTreeSelect;
    case "date-time-range":
      return DateTimeRangePicker;
    case "cascade-select":
      return FilterCascadeSelect;
    default:
      return FilterInput;
  }
};

// Default value factories using Strategy Pattern
const defaultValueFactories: Record<FilterInputType, () => AnyFilterValue> = {
  text: () => "",
  select: () => "",
  "multi-select": () => [],
  "tree-multi-select": () => [],
  "date-time-range": () => ({ from: undefined, to: undefined }),
  "cascade-select": () => ({ level1: undefined, level2: undefined }),
};

const getDefaultValue = (type?: FilterInputType): AnyFilterValue => {
  const factory = defaultValueFactories[type || "text"];
  return factory ? factory() : "";
};

// Initialize with correct type based on first option
const currentValue = ref<AnyFilterValue>(
  getDefaultValue(props.options[0]?.type)
);

// Reset value and lazy load options when key changes
watch(selectedKey, async () => {
  // Reset value based on type FIRST
  currentValue.value = getDefaultValue(currentOption.value?.type);

  // Lazy load options if available
  if (currentOption.value?.loadOptions) {
    await currentOption.value.loadOptions();
  }
});

// Update selectedKey if options change and current key is invalid
watch(
  () => props.options,
  (newOptions) => {
    if (
      newOptions.length > 0 &&
      !newOptions.find((o) => o.value === selectedKey.value)
    ) {
      selectedKey.value = newOptions[0]?.value || "";
    }
  },
  { immediate: true }
);

const handleSearch = () => {
  const formatFn = currentOption.value?.formatValue;
  const formattedValue = formatFn
    ? formatFn(currentValue.value)
    : currentValue.value;

  emit("search", {
    key: selectedKey.value,
    value: formattedValue,
  });
};

const removeFilter = (key: string, item: ActiveFilterItem) => {
  activeFilters.value = activeFilters.value?.filter((f) => f.key !== key) || [];
  emit("removeFilter", { key, item });
};

const clearAllFilters = () => {
  activeFilters.value = [];
  emit("clearAllFilters");
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Search Input -->
    <div class="flex items-center">
      <Select v-model="selectedKey">
      <SelectTrigger class="w-50 rounded-r-none border-r-0 focus:ring-0">
        <SelectValue :placeholder="$t('selectColumn')" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <component
      :is="resolveComponent(currentOption?.type)"
      :model-value="currentValue as any"
      @update:model-value="(val: any) => (currentValue = val)"
      :options="currentOption?.options"
      :level1-options="currentOption?.options"
      :placeholder="currentOption?.placeholder"
      :total="currentOption?.total"
      :current-page="currentOption?.currentPage"
      :page-size="currentOption?.pageSize"
      :level1-label="currentOption?.level1Label"
      :level2-label="currentOption?.level2Label"
      :load-children="currentOption?.loadChildren"
      :locale="props.locale"
      class="rounded-none border"
      @search="handleSearch"
      @load-more="currentOption?.loadMore?.()"
      @load-children="emit('loadChildren', $event)"
      :id="currentOption?.label"
    />

    <Button
      size="icon"
      variant="outline"
      class="rounded-l-none border-l-0 bg-transparent"
      @click="handleSearch"
    >
      <Search class="h-4 w-4" />
    </Button>
    </div>

    <!-- Active Filters -->
    <div v-if="activeFilters?.length" class="flex flex-wrap gap-2 items-center">
      <div
        v-for="item in activeFilters"
        :key="item.key"
        class="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-md"
      >
        <span class="truncate max-w-40">{{ item.label }}: {{ item.displayValue }}</span>
        <button
          class="hover:bg-muted-foreground/20 rounded p-0.5"
          @click="removeFilter(item.key, item)"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
      <button
        class="text-xs text-muted-foreground hover:text-foreground"
        @click="clearAllFilters"
      >
        清除全部
      </button>
    </div>
  </div>
</template>
