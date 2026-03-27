<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Search } from "lucide-vue-next";
import type {
  FilterOption,
  FilterValue,
  FilterInputType,
  AnyFilterValue,
  ActiveFilterItem,
  SelectOption,
} from "./types";
import { GetI18nText, type Locale } from "./locales";
import { cn } from "@/lib/utils";
import FilterInput from "./FilterInput.vue";
import FilterSelect from "./FilterSelect.vue";
import FilterMultiSelect from "./FilterMultiSelect.vue";
import FilterTreeSelect from "./FilterTreeSelect.vue";
import FilterCascadeSelect from "./FilterCascadeSelect.vue";
import FilterClearButton from "./FilterClearButton.vue";
import {
  DatePicker,
  DateRangePicker,
  DateTimeRangePicker,
} from "@/components/date-time-range-picker";
import type {
  DateRange,
  DateTimeRange,
} from "@/components/date-time-range-picker";

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

const dateFormatterLocale = computed(() =>
  props.locale === "zhHans" ? "zh-CN" : "en-US",
);

const selectedKey = ref(props.options[0]?.value || "");
const currentOption = computed(() =>
  props.options.find((o) => o.value === selectedKey.value),
);

const resolveComponent = (type?: FilterInputType) => {
  switch (type) {
    case "select":
      return FilterSelect;
    case "multi-select":
      return FilterMultiSelect;
    case "tree-multi-select":
      return FilterTreeSelect;
    case "date":
      return DatePicker;
    case "date-range":
      return DateRangePicker;
    case "date-time-range":
      return DateTimeRangePicker;
    case "cascade-select":
      return FilterCascadeSelect;
    default:
      return FilterInput;
  }
};

const flattenOptions = (options?: SelectOption[]) => {
  const result: SelectOption[] = [];
  const walk = (opts?: SelectOption[]) => {
    if (!opts) return;
    opts.forEach((opt) => {
      result.push(opt);
      if (opt.children?.length) {
        walk(opt.children);
      }
    });
  };
  walk(options);
  return result;
};

const getOptionLabelMap = (options?: SelectOption[]) => {
  const map = new Map<string, string>();
  flattenOptions(options).forEach((opt) => {
    map.set(String(opt.value), opt.label);
  });
  return map;
};

// Default value factories using Strategy Pattern
const defaultValueFactories: Record<FilterInputType, () => AnyFilterValue> = {
  text: () => "",
  select: () => "",
  "multi-select": () => [],
  "tree-multi-select": () => [],
  date: () => undefined,
  "date-range": () => ({ from: undefined, to: undefined }),
  "date-time-range": () => ({ from: undefined, to: undefined }),
  "cascade-select": () => ({ level1: undefined, level2: undefined }),
};

const getDefaultValue = (type?: FilterInputType): AnyFilterValue => {
  const factory = defaultValueFactories[type || "text"];
  return factory ? factory() : "";
};

const currentValue = ref<AnyFilterValue>(
  getDefaultValue(props.options[0]?.type),
);

const loadOptionsState = ref({
  key: "",
  seq: 0,
  inFlight: false,
});

// Reset value and lazy load options when key changes
watch(
  selectedKey,
  async () => {
    // Reset value based on type FIRST
    currentValue.value = getDefaultValue(currentOption.value?.type);

    // Lazy load options if available
    if (currentOption.value?.loadOptions) {
      const key = selectedKey.value;
      if (loadOptionsState.value.inFlight && loadOptionsState.value.key === key) {
        return;
      }
      const seq = (loadOptionsState.value.seq += 1);
      loadOptionsState.value.key = key;
      loadOptionsState.value.inFlight = true;
      try {
        await currentOption.value.loadOptions();
      } finally {
        if (loadOptionsState.value.seq === seq) {
          loadOptionsState.value.inFlight = false;
        }
      }
    }
  },
  { immediate: true },
);

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
  { immediate: true },
);

const formatFilterValue = (
  value: AnyFilterValue,
  type?: FilterInputType,
): string => {
  const formatDateValue = (
    date: Date | undefined,
    withTime = false,
  ): string => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(dateFormatterLocale.value, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...(withTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
          }
        : {}),
    }).format(date);
  };

  switch (type) {
    case "multi-select":
    case "tree-multi-select": {
      if (!Array.isArray(value) || value.length === 0) return "";
      const map = getOptionLabelMap(currentOption.value?.options);
      const labels = value.map((val) => map.get(String(val)) || String(val));
      return labels.join(", ");
    }
    case "select": {
      const label = currentOption.value?.options?.find(
        (opt) => opt.value === value,
      )?.label;
      return label || String(value ?? "");
    }
    case "date":
      return formatDateValue(value as Date | undefined);
    case "date-range": {
      const range = value as DateRange;
      const from = formatDateValue(range?.from);
      const to = formatDateValue(range?.to);
      return [from, to].filter(Boolean).join(" - ");
    }
    case "date-time-range": {
      const range = value as DateTimeRange;
      const from = formatDateValue(range?.from, true);
      const to = formatDateValue(range?.to, true);
      return [from, to].filter(Boolean).join(" - ");
    }
    case "cascade-select": {
      const casc = value as { level1?: string; level2?: string };
      return [casc.level1, casc.level2].filter(Boolean).join(" / ");
    }
    default:
      return String(value ?? "");
  }
};

const isEmptyFilterValue = (
  value: AnyFilterValue,
  type?: FilterInputType,
): boolean => {
  switch (type) {
    case "multi-select":
    case "tree-multi-select":
      return !Array.isArray(value) || value.length === 0;
    case "date":
      return !(value instanceof Date) || Number.isNaN(value.getTime());
    case "date-range": {
      const range = value as DateRange;
      return !(range?.from instanceof Date) || Number.isNaN(range.from.getTime());
    }
    case "date-time-range": {
      const range = value as DateTimeRange;
      return !range?.from && !range?.to;
    }
    case "cascade-select": {
      const cascade = value as { level1?: string; level2?: string };
      return !cascade?.level1 && !cascade?.level2;
    }
    case "select":
      return value == null || String(value) === "";
    case "text":
    default:
      return String(value ?? "").trim() === "";
  }
};

const hasCurrentValue = computed(
  () => !isEmptyFilterValue(currentValue.value, currentOption.value?.type),
);

const isDateLikeFilter = computed(() =>
  ["date", "date-range", "date-time-range"].includes(
    currentOption.value?.type || "",
  ),
);

const currentInputClass = computed(() =>
  cn("w-full min-w-0 rounded-none border", isDateLikeFilter.value && "pr-10"),
);

const currentInputWrapperClass = computed(() =>
  cn("group relative min-w-0 max-w-full flex-1 lg:w-50 lg:flex-none"),
);

const resetCurrentValue = () => {
  currentValue.value = getDefaultValue(currentOption.value?.type);
};

const removeActiveFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter((filter) => filter.key !== key);
};

const handleSearch = () => {
  const formatFn = currentOption.value?.formatValue;
  const formattedValue = formatFn
    ? formatFn(currentValue.value)
    : currentValue.value;

  if (isEmptyFilterValue(currentValue.value, currentOption.value?.type)) {
    removeActiveFilter(selectedKey.value);
    emit("search", { key: selectedKey.value, value: formattedValue });
    return;
  }

  const newItem: ActiveFilterItem = {
    key: selectedKey.value,
    label: currentOption.value?.label || "",
    value: formattedValue,
    displayValue: formatFilterValue(
      currentValue.value,
      currentOption.value?.type,
    ),
  };

  const existingIndex = activeFilters.value.findIndex(
    (f) => f.key === selectedKey.value,
  );
  if (existingIndex >= 0) {
    activeFilters.value[existingIndex] = newItem;
  } else {
    activeFilters.value.push(newItem);
  }

  emit("search", { key: selectedKey.value, value: formattedValue });
};

const handleClearCurrentValue = () => {
  const hadActiveFilter = activeFilters.value.some(
    (filter) => filter.key === selectedKey.value,
  );
  resetCurrentValue();
  removeActiveFilter(selectedKey.value);

  if (hadActiveFilter) {
    const formatFn = currentOption.value?.formatValue;
    const formattedValue = formatFn
      ? formatFn(currentValue.value)
      : currentValue.value;
    emit("search", { key: selectedKey.value, value: formattedValue });
  }
};

const clearValueByKey = (key: string) => {
  if (key !== selectedKey.value) return;
  resetCurrentValue();
};

defineExpose({
  clearCurrentValue: resetCurrentValue,
  clearValueByKey,
});
</script>

<template>
  <div class="flex w-full min-w-0 max-w-full items-center lg:inline-flex lg:w-auto">
    <Select v-model="selectedKey">
      <SelectTrigger class="w-32 shrink-0 rounded-r-none border-r-0 focus:ring-0 sm:w-40 xl:w-50">
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

    <div :class="currentInputWrapperClass">
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
        :loading="currentOption?.loading"
        :level1-label="currentOption?.level1Label"
        :level2-label="currentOption?.level2Label"
        :load-children="currentOption?.loadChildren"
        :locale="props.locale"
        :class="currentInputClass"
        @search="handleSearch"
        @load-more="currentOption?.loadMore?.()"
        @load-children="emit('loadChildren', $event)"
        :id="currentOption?.label"
      />
      <FilterClearButton
        :visible="hasCurrentValue"
        @click="handleClearCurrentValue"
      />
    </div>

    <Button
      size="icon"
      variant="outline"
      class="shrink-0 rounded-l-none border-l-0 bg-transparent"
      @click="handleSearch"
    >
      <Search class="h-4 w-4" />
    </Button>
  </div>
</template>
