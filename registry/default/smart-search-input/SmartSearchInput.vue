<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Search } from "lucide-vue-next";
import type {
  FilterOption,
  FilterValue,
  FilterInputType,
  AnyFilterValue,
  ActiveFilterItem,
} from "./types";
import { GetI18nText, type Locale } from "./locales";
import FilterInput from "./FilterInput.vue";
import FilterSelect from "./FilterSelect.vue";
import FilterMultiSelect from "./FilterMultiSelect.vue";
import FilterTreeSelect from "./FilterTreeSelect.vue";
import FilterCascadeSelect from "./FilterCascadeSelect.vue";
import { DateTimeRangePicker } from "@/components/date-time-range-picker";

const props = withDefaults(
  defineProps<{
    options: FilterOption[];
    locale?: Locale;
  }>(),
  {
    locale: "en",
  },
);

const emit = defineEmits<{
  (e: "search", value: FilterValue): void;
  (e: "loadMore", filterKey: string): void;
  (e: "loadChildren", parentId: string): void;
}>();

const activeFilters = defineModel<ActiveFilterItem[]>("activeFilters", {
  default: () => [],
});

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

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

const formatFilterValue = (value: AnyFilterValue, type?: FilterInputType): string => {
  switch (type) {
    case "multi-select":
    case "tree-multi-select": {
      if (!Array.isArray(value) || value.length === 0) return "";
      const labels = currentOption.value?.options?.filter(
        (opt) => value.includes(opt.value)
      ).map((opt) => opt.label);
      return labels?.join(", ") || value.map(String).join(", ");
    }
    case "select": {
      const label = currentOption.value?.options?.find(
        (opt) => opt.value === value
      )?.label;
      return label || String(value ?? "");
    }
    case "date-time-range": {
      const range = value as { from?: string; to?: string };
      return `${range.from || ""} - ${range.to || ""}`;
    }
    case "cascade-select": {
      const casc = value as { level1?: string; level2?: string };
      return [casc.level1, casc.level2].filter(Boolean).join(" / ");
    }
    default:
      return String(value ?? "");
  }
};

const handleSearch = () => {
  const formatFn = currentOption.value?.formatValue;
  const formattedValue = formatFn
    ? formatFn(currentValue.value)
    : currentValue.value;

  const newItem: ActiveFilterItem = {
    key: selectedKey.value,
    label: currentOption.value?.label || "",
    value: currentValue.value,
    displayValue: formatFilterValue(currentValue.value, currentOption.value?.type),
  };

  const existingIndex = activeFilters.value.findIndex(
    (f) => f.key === selectedKey.value
  );
  if (existingIndex >= 0) {
    activeFilters.value[existingIndex] = newItem;
  } else {
    activeFilters.value.push(newItem);
  }

  emit("search", { key: selectedKey.value, value: formattedValue });
};
</script>

<template>
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
</template>
