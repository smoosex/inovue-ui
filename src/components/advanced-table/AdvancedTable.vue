<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch, nextTick, onMounted } from "vue";
import ColumnToggle from "./ColumnToggle.vue";
import TablePagination from "./TablePagination.vue";
import type { Column, Locale, RowKeyType } from "./types";
import { GetI18nText } from "./locales";
import { useResizeObserver } from "@vueuse/core";
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toolbar } from "@/components/toolbar";
import type { ToolbarAction } from "@/components/toolbar";
import {
  SmartSearchInput,
  ActiveFilterTags,
} from "@/components/smart-search-input";
import type {
  FilterOption,
  FilterValue,
  ActiveFilterItem,
} from "@/components/smart-search-input";

type Props = {
  data: T[];
  total: number;
  showCheckbox?: boolean;
  showColumnToggle?: boolean;
  showExpand?: boolean;
  rowExpandable?: (row: T) => boolean;
  rowExpandMode?: (row: T) => "children" | "slot" | false;
  showPagination?: boolean;
  loading?: boolean;
  rowKey?: string;
  locale?: Locale;
  onReset?: () => void;
  showToolbar?: boolean;
  showSmartSearch?: boolean;
  showActiveFilters?: boolean;
  toolbarPrimaryActions?: ToolbarAction[];
  toolbarSecondaryActions?: ToolbarAction[];
  filterOptions?: FilterOption[];
};

const props = withDefaults(defineProps<Props>(), {
  showCheckbox: true,
  showColumnToggle: true,
  showExpand: false,
  showPagination: true,
  loading: false,
  rowKey: "id",
  locale: "en",
  showToolbar: false,
  showSmartSearch: false,
  showActiveFilters: false,
});

const emit = defineEmits<{
  (e: "search", value: FilterValue): void;
  (e: "filter-remove", key: string): void;
  (e: "filter-clear-all"): void;
  (
    e: "row-expand-change",
    payload: { row: T; expanded: boolean; key: RowKeyType },
  ): void;
}>();

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

const selectedIds = defineModel<RowKeyType[]>("selectedIds", { default: [] });
const columns = defineModel<Column[]>("columns", { required: true });
const pageNum = defineModel<number>("pageNum", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });
const activeFilters = defineModel<ActiveFilterItem[]>("activeFilters", { default: () => [] });

const visibleColumns = computed(() => columns.value.filter((col) => col.show));
const hasChildrenRows = computed(() =>
  props.data.some((row) => Array.isArray((row as any).children) && (row as any).children.length > 0),
);
const useChildrenExpand = computed(() => hasChildrenRows.value);
const showExpandButton = computed(
  () => useChildrenExpand.value || props.showExpand || Boolean(props.rowExpandMode),
);
const tableColspan = computed(
  () =>
    visibleColumns.value.length +
    (props.showCheckbox ? 1 : 0) +
    (props.showColumnToggle ? 1 : 0) +
    (showExpandButton.value ? 1 : 0),
);
const rightStickyOffset = computed(() =>
  props.showColumnToggle ? "56px" : "0px",
);

const allSelected = computed(() => {
  return (
    props.data.length > 0 &&
    props.data.every((item) => selectedIds.value.includes(item[props.rowKey]))
  );
});

const toggleAll = (checked: boolean) => {
  if (checked) {
    selectedIds.value = props.data.map((item) => item[props.rowKey]);
  } else {
    selectedIds.value = [];
  }
};

const toggleOne = (id: RowKeyType, checked: boolean) => {
  const newSelected = [...selectedIds.value];
  if (checked) {
    newSelected.push(id);
  } else {
    const index = newSelected.indexOf(id);
    if (index > -1) {
      newSelected.splice(index, 1);
    }
  }
  selectedIds.value = newSelected;
};

const expandedIds = ref<RowKeyType[]>([]);
const resolveExpandMode = (row: T) => {
  if (props.rowExpandMode) return props.rowExpandMode(row);
  const children = (row as any).children;
  if (Array.isArray(children) && children.length > 0) return "children";
  return props.showExpand ? "slot" : false;
};
const canExpandRow = (row: T) => {
  const mode = resolveExpandMode(row);
  if (!mode) return false;
  return props.rowExpandable ? props.rowExpandable(row) : true;
};
const getRowExpandMode = (row: T) => resolveExpandMode(row);
const isExpanded = (key: RowKeyType) => expandedIds.value.includes(key);
const toggleExpand = (row: T) => {
  if (!canExpandRow(row)) return;
  const key = row[props.rowKey] as RowKeyType;
  const next = [...expandedIds.value];
  const index = next.indexOf(key);
  const expanded = index === -1;
  if (expanded) {
    next.push(key);
  } else {
    next.splice(index, 1);
  }
  expandedIds.value = next;
  emit("row-expand-change", { row, expanded, key });
};
const scrollContainer = ref<HTMLElement | null>(null);
const tableRef = ref<HTMLElement | null>(null);
const isScrollable = ref(false);
const tableWidth = ref(0);

const checkScrollable = () => {
  if (!scrollContainer.value) return;
  isScrollable.value =
    scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
};

const updateTableWidth = () => {
  nextTick(() => {
    const root = (tableRef.value as any)?.$el;
    const tableEl = root?.querySelector("table");
    if (tableEl) {
      tableWidth.value = tableEl.clientWidth;
    }
  });
};

useResizeObserver(scrollContainer, checkScrollable);
useResizeObserver(tableRef, updateTableWidth);

watch(
  [() => props.data, columns, () => props.showCheckbox],
  () => {
    nextTick(checkScrollable);
  },
  { deep: true },
);

onMounted(() => {
  checkScrollable();
  updateTableWidth();
});

const resolveWidth = (width: string | undefined) => {
  if (!width) return undefined;
  if (width.endsWith("%")) {
    const percent = parseFloat(width) / 100;
    return `${percent * tableWidth.value}px`;
  }
  return width;
};

const getStickyStyle = (col: Column, isHeader: boolean = false) => {
  const zIndex = isHeader ? 30 : 20;
  const hasWidth = col.width !== undefined;
  const resolvedWidth = resolveWidth(col.width);
  if (col.fixed === "right") {
    return {
      position: "sticky",
      right: rightStickyOffset.value,
      zIndex,
      width: resolvedWidth,
      maxWidth: hasWidth ? resolvedWidth : undefined,
    } as const;
  }
  if (col.fixed === "left") {
    return {
      position: "sticky",
      left: "0px",
      zIndex,
      width: resolvedWidth,
      maxWidth: hasWidth ? resolvedWidth : undefined,
    } as const;
  }
  return {
    width: resolvedWidth,
    maxWidth: hasWidth ? resolvedWidth : undefined,
  } as const;
};

const firstRightFixedColumn = computed(() =>
  visibleColumns.value.find((col) => col.fixed === "right"),
);

const tooltipDisabled = ref<Record<string, boolean>>({});

const checkOverflow = (event: MouseEvent, key: string) => {
  const target = event.currentTarget as HTMLElement;
  tooltipDisabled.value[key] = target.scrollWidth <= target.clientWidth;
};

const getCellClass = (col: Column) => {
  const ellipsis = col.ellipsis ?? true;
  return ellipsis ? "truncate max-w-full" : "";
};
</script>

<template>
  <div class="h-full flex flex-col min-h-0">
    <!-- Toolbar Area -->
    <div v-if="showToolbar" class="mb-2">
      <Toolbar
        :primary-actions="toolbarPrimaryActions"
        :secondary-actions="toolbarSecondaryActions"
      >
        <SmartSearchInput
          v-if="showSmartSearch && filterOptions"
          v-model:active-filters="activeFilters"
          :options="filterOptions"
          :locale="props.locale"
          @search="(fv) => emit('search', fv)"
        />
      </Toolbar>
      <ActiveFilterTags
        v-if="showActiveFilters"
        v-model:filters="activeFilters"
        :locale="props.locale"
        @remove="(key) => emit('filter-remove', key)"
        @clear-all="emit('filter-clear-all')"
      />
    </div>

    <!-- Table Area -->
    <div
      class="flex-1 overflow-auto relative border rounded-md"
      ref="scrollContainer"
    >
      <Table class="table-auto" ref="tableRef">
        <TableHeader
          class="sticky top-0 z-30 bg-muted [&_th]:font-bold [&_th:first-child]:pl-4 [&_th:last-child]:pr-4"
        >
          <TableRow>
            <TableHead v-if="showExpandButton" class="w-12.5" />
            <TableHead v-if="showCheckbox" class="w-12.5">
              <Checkbox
                id="select-all"
                :model-value="allSelected"
                @update:model-value="(v) => toggleAll(v as boolean)"
              />
            </TableHead>
            <TableHead
              v-for="col in visibleColumns"
              :key="col.value"
              class="whitespace-nowrap h-11 px-4 transition-shadow duration-300"
              :style="getStickyStyle(col, true)"
              :class="{
                'bg-muted': col.fixed && isScrollable,
                'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                  col.fixed === 'left' && isScrollable,
                'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                  col.fixed === 'right' &&
                  col.value === firstRightFixedColumn?.value &&
                  isScrollable,
              }"
            >
              {{ col.label }}
            </TableHead>
            <TableHead
              v-if="showColumnToggle"
              class="w-12.5 text-right sticky right-0 z-20 transition-shadow duration-300"
              :class="{
                'bg-muted': isScrollable,
                'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                  !firstRightFixedColumn && isScrollable,
              }"
            >
              <ColumnToggle
                v-model="columns"
                :on-reset="props.onReset"
                :locale="props.locale"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="[&_tr>td:first-child]:pl-4 [&_tr>td:last-child]:pr-4">
          <template v-if="data.length > 0">
            <template v-for="row in data" :key="row[rowKey]">
              <TableRow>
                <TableCell v-if="showExpandButton">
                  <Button
                    v-if="canExpandRow(row)"
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7"
                    @click="toggleExpand(row)"
                  >
                    <ChevronDown v-if="isExpanded(row[rowKey])" class="h-4 w-4" />
                    <ChevronRight v-else class="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell v-if="showCheckbox">
                  <Checkbox
                    :id="'select-' + row[rowKey]"
                    :model-value="selectedIds.includes(row[rowKey])"
                    @update:model-value="
                      (val) => toggleOne(row[rowKey], val as boolean)
                    "
                  />
                </TableCell>
                <TableCell
                  v-for="col in visibleColumns"
                  :key="col.value"
                  class="whitespace-nowrap py-2 px-4 transition-shadow duration-300"
                  :style="getStickyStyle(col)"
                  :class="[
                    {
                      'bg-background': col.fixed && isScrollable,
                      'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                        col.fixed === 'left' && isScrollable,
                      'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                        col.fixed === 'right' &&
                        col.value === firstRightFixedColumn?.value &&
                        isScrollable,
                    },
                    getCellClass(col),
                  ]"
                >
                  <Tooltip
                    v-if="col.enableAutoTooltip !== false"
                    :disabled="tooltipDisabled[`${row[rowKey]}-${col.value}`]"
                  >
                    <TooltipTrigger as-child>
                      <div
                        class="truncate min-w-0"
                        @mouseenter="
                          checkOverflow($event, `${row[rowKey]}-${col.value}`)
                        "
                      >
                        <slot
                          name="cell"
                          :row="row"
                          :column="col"
                          :text="(row as any)[col.value]"
                        >
                          {{ (row as any)[col.value] }}
                        </slot>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <slot
                        name="cell"
                        :row="row"
                        :column="col"
                        :text="(row as any)[col.value]"
                      >
                        {{ (row as any)[col.value] }}
                      </slot>
                    </TooltipContent>
                  </Tooltip>
                  <slot
                    v-else
                    name="cell"
                    :row="row"
                    :column="col"
                    :text="(row as any)[col.value]"
                  >
                    {{ (row as any)[col.value] }}
                  </slot>
                </TableCell>
                <TableCell
                  v-if="showColumnToggle"
                  class="sticky right-0 z-20 transition-shadow duration-300"
                  :class="{
                    'bg-background': isScrollable,
                    'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]':
                      !firstRightFixedColumn && isScrollable,
                  }"
                />
              </TableRow>
                <template
                  v-if="
                    showExpandButton &&
                    canExpandRow(row) &&
                    isExpanded(row[rowKey])
                  "
                >
                  <template v-if="getRowExpandMode(row) === 'children'">
                    <TableRow
                      v-for="(child, childIndex) in (row as any).children"
                      :key="`${row[rowKey]}-child-${childIndex}`"
                      class="bg-muted/30"
                    >
                      <TableCell v-if="showExpandButton" />
                      <TableCell v-if="showCheckbox" />
                    <TableCell
                      v-for="col in visibleColumns"
                      :key="col.value"
                      class="whitespace-nowrap py-2 px-4"
                    >
                      <Tooltip
                        v-if="col.enableAutoTooltip !== false"
                        :disabled="
                          tooltipDisabled[
                            `${row[rowKey]}-child-${childIndex}-${col.value}`
                          ]
                        "
                      >
                        <TooltipTrigger as-child>
                          <div
                            class="truncate min-w-0"
                            @mouseenter="
                              checkOverflow(
                                $event,
                                `${row[rowKey]}-child-${childIndex}-${col.value}`
                              )
                            "
                          >
                            <slot
                              name="cell"
                              :row="child"
                              :column="col"
                              :text="(child as any)[col.value]"
                            >
                              {{ (child as any)[col.value] }}
                            </slot>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <slot
                            name="cell"
                            :row="child"
                            :column="col"
                            :text="(child as any)[col.value]"
                          >
                            {{ (child as any)[col.value] }}
                          </slot>
                        </TooltipContent>
                      </Tooltip>
                      <slot
                        v-else
                        name="cell"
                        :row="child"
                        :column="col"
                        :text="(child as any)[col.value]"
                      >
                        {{ (child as any)[col.value] }}
                      </slot>
                    </TableCell>
                      <TableCell v-if="showColumnToggle" />
                    </TableRow>
                  </template>
                  <TableRow v-else class="bg-muted/30">
                    <TableCell :colspan="tableColspan" class="py-0">
                      <slot name="expanded" :row="row" />
                    </TableCell>
                  </TableRow>
                </template>
              </template>
            </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="tableColspan" class="h-24 text-center">
                {{ $t("noResults") }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination Area -->
    <TablePagination
      v-if="showPagination"
      v-model:pageNum="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      :locale="props.locale"
    />
  </div>
</template>

<style scoped>
:deep(.relative.w-full.overflow-auto) {
  overflow: visible !important;
}
</style>
