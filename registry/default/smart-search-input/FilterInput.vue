<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { X } from "lucide-vue-next";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  placeholder?: string;
  id?: string;
}>();

const inputId =
  props.id || `filter-input-${Math.random().toString(36).slice(2)}`;

const modelValue = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: "search"): void;
}>();

const handleClear = () => {
  modelValue.value = "";
  emit("search");
};

const inputClass = computed(() =>
  cn(
    "w-50 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
    attrs.class as string
  )
);
</script>

<template>
  <div class="relative flex items-center flex-1">
    <Input
      :id="inputId"
      v-model="modelValue"
      :placeholder="placeholder || 'Search'"
      :class="inputClass"
      @keyup.enter="emit('search')"
    />
    <button
      v-if="modelValue"
      @click="handleClear"
      class="absolute right-2 text-muted-foreground hover:text-foreground"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
