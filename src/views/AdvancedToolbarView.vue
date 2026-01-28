<script setup lang="ts">
import { ref } from "vue";
import { Toolbar } from "@/components/toolbar";
import { type ToolbarAction } from "@/components/toolbar";
import { LucidePlus, LucideEdit, LucideTrash2, LucideDownload, LucideSettings } from "lucide-vue-next";

const handleAdd = () => {
  console.log("Add clicked");
};

const handleEdit = () => {
  console.log("Edit clicked");
};

const handleDelete = () => {
  console.log("Delete clicked");
};

const handleExport = () => {
  console.log("Export clicked");
};

const handleSettings = () => {
  console.log("Settings clicked");
};

const primaryActions = ref<ToolbarAction[]>([
  {
    key: "add",
    label: "新增",
    icon: LucidePlus,
    variant: "default",
    onClick: handleAdd,
  },
  {
    key: "edit",
    label: "编辑",
    icon: LucideEdit,
    variant: "outline",
    onClick: handleEdit,
    show: true,
  },
  {
    key: "delete",
    label: "删除",
    icon: LucideTrash2,
    variant: "destructive",
    onClick: handleDelete,
    show: true,
  },
]);

const secondaryActions = ref<ToolbarAction[]>([
  {
    key: "export",
    label: "导出",
    icon: LucideDownload,
    variant: "outline",
    onClick: handleExport,
    isIconOnly: false,
  },
  {
    key: "settings",
    tooltip: "设置",
    icon: LucideSettings,
    variant: "ghost",
    onClick: handleSettings,
    isIconOnly: true,
  },
]);
</script>

<template>
  <div class="h-screen flex flex-col p-4 pt-0">
    <div class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.navigation.advancedToolbar") }}
      </h1>
    </div>

    <Toolbar
      :primary-actions="primaryActions"
      :secondary-actions="secondaryActions"
      class="mt-4"
    />

    <div class="mt-8 p-4 border rounded-lg bg-muted/20">
      <h3 class="text-lg font-semibold mb-2">使用示例</h3>
      <p class="text-muted-foreground">
        AdvancedToolbar 组件包含主操作区（左侧）和次要操作区（右侧）。<br>
        支持配置按钮的图标、标签、变体、尺寸，以及 icon-only 模式。
      </p>
    </div>
  </div>
</template>
