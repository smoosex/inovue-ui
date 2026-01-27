<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { AdvancedTable } from "@/components/advanced-table";
import type { Column } from "@/components/advanced-table";
import { GetUsersApi, type User } from "@/features/users/api";

const { locale } = useI18n();

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedIds = ref<string[]>([]);
const showColumnToggle = ref(true);
const loading = ref(false);

const columns = reactive<Column[]>([
  { label: "ID", value: "id", show: true, originalIndex: 0, width: "80px" },
  { label: "姓名", value: "name", show: true, originalIndex: 1 },
  { label: "邮箱", value: "email", show: true, originalIndex: 2 },
  { label: "角色", value: "role", show: true, originalIndex: 3 },
  { label: "状态", value: "status", show: true, originalIndex: 4 },
  { label: "最后登录", value: "lastLogin", show: false, originalIndex: 5 },
]);

const mockData = ref<User[]>([]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await GetUsersApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    });
    mockData.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const toggleColumnToggle = () => {
  showColumnToggle.value = !showColumnToggle.value;
};

watch([pageNum, pageSize], () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="flex flex-col flex-1 h-full space-y-2 overflow-hidden px-4 py-2">
    <!-- Toolbar -->
    <div class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.dataDisplay.advancedTable") }}
      </h1>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="toggleColumnToggle">
          {{ showColumnToggle ? "隐藏列设置" : "显示列设置" }}
        </Button>
        <Button variant="outline" size="sm" @click="fetchUsers"> 刷新 </Button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-hidden rounded-md flex flex-col">
      <AdvancedTable
        v-model:selected-ids="selectedIds"
        v-model:columns="columns"
        v-model:page-num="pageNum"
        v-model:page-size="pageSize"
        :data="mockData"
        :total="total"
        :loading="loading"
        :show-column-toggle="showColumnToggle"
        :locale="locale === 'en' ? 'en' : 'zhHans'"
        class="flex-1 min-h-0"
        @reset="fetchUsers"
      />
    </div>
  </div>
</template>
