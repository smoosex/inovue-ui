<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import type { SelectOption } from "./types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVirtualList } from "@vueuse/core";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    options?: SelectOption[];
    placeholder?: string;
    id?: string;
    total?: number;
    currentPage?: number;
    pageSize?: number;
  }>(),
  {
    currentPage: 1,
    pageSize: 20,
  }
);

const modelValue = defineModel<(string | number)[]>("modelValue", {
  default: () => [],
});

const emit = defineEmits<{
  (e: "search"): void;
  (e: "loadMore"): void;
}>();

const open = ref(false);

const VIRTUAL_THRESHOLD = 50;

const shouldUseVirtual = computed(
  () => (props.options?.length || 0) > VIRTUAL_THRESHOLD
);

const { list, containerProps, wrapperProps } = useVirtualList(
  computed(() => props.options || []),
  {
    itemHeight: 36,
    overscan: 5,
  }
);

const selectedLabels = computed(() => {
  if (!modelValue.value || modelValue.value.length === 0) return [];
  const map = new Map(props.options?.map((o) => [String(o.value), o.label]));
  return modelValue.value.map((v) => map.get(String(v)) || String(v));
});

const toggleSelection = (val: string | number) => {
  const strVal = String(val);
  const current = modelValue.value.map(String);
  const idx = current.indexOf(strVal);
  let newValue: (string | number)[];

  if (idx > -1) {
    newValue = [...modelValue.value];
    newValue.splice(idx, 1);
  } else {
    newValue = [...modelValue.value, val];
  }

  modelValue.value = newValue;
};

const handleClear = () => {
  modelValue.value = [];
  emit("search");
};

const handleLoadMore = () => {
  emit("loadMore");
};

const hasMore = computed(() => {
  return props.currentPage * props.pageSize < (props.total || 0);
});

const triggerClass = computed(() =>
  cn("w-50 justify-between rounded-none", attrs.class as string)
);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="triggerClass"
        :id="id"
      >
        <span v-if="modelValue.length === 0" class="text-muted-foreground">
          {{ placeholder || "Select" }}
        </span>
        <div
          v-else-if="selectedLabels.length <= 3"
          class="flex gap-1 overflow-hidden"
        >
          <Badge
            v-for="(label, idx) in selectedLabels"
            :key="idx"
            variant="secondary"
            class="rounded-sm px-1.5 py-0 text-xs font-normal shrink-0"
          >
            {{ label }}
          </Badge>
        </div>
        <Badge
          v-else
          variant="secondary"
          class="rounded-sm px-1.5 py-0 text-xs font-normal"
        >
          {{ selectedLabels.length }} selected
        </Badge>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0" align="start" style="width: var(--reka-popper-anchor-width)">
      <Command v-if="open">
        <CommandInput :placeholder="placeholder" :id="id" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup>
            <template v-if="options && options.length > 0">
              <div v-if="shouldUseVirtual" v-bind="containerProps" class="h-64 overflow-auto">
                <div v-bind="wrapperProps">
                  <CommandItem
                    v-for="{ data } in list"
                    :key="data.value"
                    :value="data.label"
                    @select="toggleSelection(data.value)"
                    :style="{ height: '36px' }"
                    class="!flex-1 !w-full flex items-center"
                  >
                    <div
                      class="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary shrink-0"
                      :class="
                        modelValue.map(String).includes(String(data.value))
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      "
                    >
                      <Check class="h-4 w-4" />
                    </div>
                    <span>{{ data.label }}</span>
                  </CommandItem>
                </div>
              </div>
              <template v-else>
                <CommandItem
                  v-for="option in options"
                  :key="option.value"
                  :value="option.label"
                  @select="toggleSelection(option.value)"
                >
                  <div
                    class="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary shrink-0"
                    :class="
                      modelValue.map(String).includes(String(option.value))
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    "
                  >
                    <Check class="h-4 w-4" />
                  </div>
                  <span>{{ option.label }}</span>
                </CommandItem>
              </template>
            </template>
            <CommandItem
              v-if="hasMore"
              :value="'{load-more}'"
              class="justify-center text-center text-muted-foreground"
              @select="handleLoadMore"
            >
              Load more
            </CommandItem>
          </CommandGroup>
          <template v-if="modelValue.length > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="'{clear}'"
                class="justify-center text-center"
                @select="handleClear"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
