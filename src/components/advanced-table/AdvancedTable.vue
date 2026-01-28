<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch, nextTick, onMounted } from "vue";
import ColumnToggle from "./ColumnToggle.vue";
import TablePagination from "./TablePagination.vue";
import type { Column, Locale } from "./types";
import { getI18nText } from "./locales";
import { useResizeObserver } from "@vueuse/core";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: T[];
  total: number;
  showCheckbox?: boolean;
  showColumnToggle?: boolean;
  loading?: boolean;
  rowKey?: string;
  locale?: Locale;
  onReset?: () => void;
};

const props = withDefaults(defineProps<Props>(), {
  showCheckbox: true,
  showColumnToggle: true,
  loading: false,
  rowKey: "id",
  locale: "zhHans",
});

const $t = (key: Parameters<typeof getI18nText>[0]) =>
  getI18nText(key, props.locale);

const selectedIds = defineModel<string[]>("selectedIds", { default: [] });
const columns = defineModel<Column[]>("columns", { required: true });
const pageNum = defineModel<number>("pageNum", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });

const visibleColumns = computed(() => columns.value.filter((col) => col.show));

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

const toggleOne = (id: string, checked: boolean) => {
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
      right: "56px",
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
            <TableRow v-for="row in data" :key="row[rowKey]">
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
          </template>
          <template v-else>
            <TableRow>
              <TableCell
                :colspan="
                  visibleColumns.length +
                  (showCheckbox ? 1 : 0) +
                  (showColumnToggle ? 1 : 0)
                "
                class="h-24 text-center"
              >
                {{ $t("noResults") }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination Area -->
    <TablePagination
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
