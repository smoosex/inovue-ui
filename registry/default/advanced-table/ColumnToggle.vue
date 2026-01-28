<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Settings2,
  GripVertical,
  Plus,
  X,
  Search,
  XCircle,
} from "lucide-vue-next";
import { VueDraggable } from "vue-draggable-plus";
import type { Column, Locale } from "./types";
import { GetI18nText } from "./locales";

const props = withDefaults(
  defineProps<{
    modelValue: Column[];
    onReset?: () => void;
    locale?: Locale;
  }>(),
  {
    locale: "zhHans",
  },
);

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);

// Local state for editing
const localAvailableColumns = ref<Column[]>([]);
const localSelectedColumns = ref<Column[]>([]);

// Search states
const availableSearchQuery = ref("");
const selectedSearchQuery = ref("");

// Filtered columns
const filteredAvailableColumns = computed(() => {
  if (!availableSearchQuery.value.trim()) return localAvailableColumns.value;
  const query = availableSearchQuery.value.toLowerCase();
  return localAvailableColumns.value.filter((col) =>
    col.label.toLowerCase().includes(query),
  );
});

const filteredSelectedColumns = computed(() => {
  if (!selectedSearchQuery.value.trim()) return localSelectedColumns.value;
  const query = selectedSearchQuery.value.toLowerCase();
  return localSelectedColumns.value.filter((col) =>
    col.label.toLowerCase().includes(query),
  );
});

// Clear search handlers
const clearAvailableSearch = () => {
  availableSearchQuery.value = "";
};

const clearSelectedSearch = () => {
  selectedSearchQuery.value = "";
};

// Initialize local state when drawer opens
watch(isOpen, (newVal) => {
  if (newVal) {
    localAvailableColumns.value = props.modelValue
      .filter((c) => !c.show && !c.hideInSetting)
      .sort((a, b) => (a.originalIndex ?? 0) - (b.originalIndex ?? 0));
    localSelectedColumns.value = props.modelValue.filter(
      (c) => c.show && !c.hideInSetting,
    );
    // Reset search when drawer opens
    availableSearchQuery.value = "";
    selectedSearchQuery.value = "";
  }
});

const addColumn = (col: Column) => {
  localAvailableColumns.value = localAvailableColumns.value.filter(
    (c) => c.value !== col.value,
  );
  localSelectedColumns.value.push({ ...col, show: true });
};

const removeColumn = (col: Column) => {
  localSelectedColumns.value = localSelectedColumns.value.filter(
    (c) => c.value !== col.value,
  );
  localAvailableColumns.value.push({ ...col, show: false });
  localAvailableColumns.value.sort(
    (a, b) => (a.originalIndex ?? 0) - (b.originalIndex ?? 0),
  );
};

const handleConfirm = () => {
  const hiddenSettingsColumns = props.modelValue.filter((c) => c.hideInSetting);

  const newColumns = [
    ...localSelectedColumns.value.map((c) => ({ ...c, show: true })),
    ...localAvailableColumns.value.map((c) => ({ ...c, show: false })),
    ...hiddenSettingsColumns,
  ];

  emit("update:modelValue", newColumns);
  isOpen.value = false;
};

const handleReset = () => {
  props.onReset?.();
  isOpen.value = false;
};
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="ml-auto hidden h-8 w-8 lg:flex"
        @click="isOpen = true"
      >
        <Settings2 class="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ $t("toggleColumns") }}</p>
    </TooltipContent>
  </Tooltip>

  <Sheet v-model:open="isOpen">
    <!-- Removed DrawerTrigger, using manual State -->
    <SheetContent class="w-150 sm:max-w-150 flex flex-col gap-0 p-0">
      <SheetHeader class="p-6 pb-4">
        <SheetTitle>{{ $t("toggleColumns") }}</SheetTitle>
        <SheetDescription>
          {{ $t("dragReorder") }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-hidden relative border-t border-b">
        <div class="h-full flex p-4 gap-4 overflow-hidden">
          <!-- Available Columns -->
          <div
            class="flex-1 border rounded-md p-4 flex flex-col gap-3 min-h-0 overflow-hidden"
          >
            <div class="flex flex-col gap-2">
              <h3 class="font-medium text-sm text-muted-foreground">
                {{ $t("availableColumns") }}
              </h3>
              <!-- Search Input -->
              <div class="relative group">
                <Search
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground"
                />
                <Input
                  id="available-search-input"
                  v-model="availableSearchQuery"
                  :placeholder="$t('searchPlaceholder')"
                  class="pl-9 pr-8"
                />
                <XCircle
                  v-if="availableSearchQuery"
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  @click="clearAvailableSearch"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto space-y-2 pr-2">
              <div
                v-for="col in filteredAvailableColumns"
                :key="col.value"
                class="flex items-center justify-between p-2 rounded-md border bg-card text-card-foreground shadow-sm shrink-0 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span class="text-sm truncate mr-2" :title="col.label">{{
                  col.label
                }}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6 shrink-0"
                  @click="addColumn(col)"
                >
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
              <div
                v-if="filteredAvailableColumns.length === 0"
                class="text-sm text-muted-foreground text-center py-8"
              >
                {{
                  availableSearchQuery
                    ? $t("noResultsFound")
                    : $t("noAvailableColumns")
                }}
              </div>
            </div>
          </div>

          <!-- Selected Columns (Draggable) -->
          <div
            class="flex-1 border rounded-md p-4 flex flex-col gap-3 min-h-0 overflow-hidden"
          >
            <div class="flex flex-col gap-2">
              <h3 class="font-medium text-sm text-muted-foreground">
                {{ $t("selectedColumns") }}
              </h3>
              <!-- Search Input -->
              <div class="relative group">
                <Search
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground"
                />
                <Input
                  id="selected-search-input"
                  v-model="selectedSearchQuery"
                  :placeholder="$t('searchPlaceholder')"
                  class="pl-9 pr-8"
                />
                <XCircle
                  v-if="selectedSearchQuery"
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  @click="clearSelectedSearch"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto pr-2">
              <VueDraggable
                v-model="localSelectedColumns"
                :animation="150"
                handle=".handle"
                class="space-y-2"
              >
                <div
                  v-for="col in filteredSelectedColumns"
                  :key="col.value"
                  class="flex items-center justify-between p-2 rounded-md border bg-card text-card-foreground shadow-sm group shrink-0 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div class="flex items-center gap-2 overflow-hidden">
                    <GripVertical
                      class="handle h-4 w-4 text-muted-foreground cursor-move opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                    <span class="text-sm truncate" :title="col.label">{{
                      col.label
                    }}</span>
                  </div>
                  <Button
                    v-if="!col.lock"
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                    @click="removeColumn(col)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </VueDraggable>
              <div
                v-if="filteredSelectedColumns.length === 0"
                class="text-sm text-muted-foreground text-center py-8"
              >
                {{
                  selectedSearchQuery
                    ? $t("noResultsFound")
                    : $t("noSelectedColumns")
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SheetFooter class="p-6">
        <div class="flex items-center justify-between w-full">
          <Button variant="destructive" @click="handleReset">
            {{ $t("reset") }}
          </Button>
          <div class="flex gap-2">
            <Button variant="outline" @click="isOpen = false">{{ $t("cancel") }}</Button>
            <Button @click="handleConfirm">{{ $t("confirm") }}</Button>
          </div>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
