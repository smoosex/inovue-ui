<script setup lang="ts">
import { useLogin } from "../composables/useLogin";
import { APP_NAME, APP_LOGO } from "@/config/constants";

const { t } = useI18n();
const { isLoading, handleLogin } = useLogin();

const username = ref("");
const password = ref("");

const isUsernameValid = computed(() => username.value.trim().length > 0);
const isPasswordValid = computed(() => password.value.length >= 6);

const onSubmit = () => {
  if (!isUsernameValid.value || !isPasswordValid.value) {
    return;
  }
  handleLogin({ username: username.value, password: password.value });
};
</script>

<template>
  <div class="relative z-10 w-full max-w-87.5 mx-auto p-4">
    <Card class="border-border/50 bg-background/80 backdrop-blur-sm shadow-xl">
      <CardHeader class="space-y-1 flex flex-col items-center">
        <div class="flex items-center gap-2 font-bold text-2xl">
          <div
            class="h-8 w-8 bg-primary"
            :style="{
              mask: `url(${APP_LOGO}) no-repeat center / contain`,
              WebkitMask: `url(${APP_LOGO}) no-repeat center / contain`,
            }"
          />
          <span>{{ APP_NAME }}</span>
        </div>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <FieldGroup class="grid gap-4">
            <Field class="grid gap-2">
              <FieldLabel for="username">{{
                t("auth.login.username")
              }}</FieldLabel>
              <Input
                id="username"
                name="username"
                v-model="username"
                type="text"
                :placeholder="t('auth.login.usernamePlaceholder')"
                autocomplete="username"
                :disabled="isLoading"
                autofocus
                :class="{
                  'border-red-500': username && !isUsernameValid,
                }"
                required
              />
            </Field>
            <Field class="grid gap-2">
              <FieldLabel for="password">{{
                t("auth.login.password")
              }}</FieldLabel>
              <Input
                id="password"
                name="password"
                v-model="password"
                type="password"
                :placeholder="t('auth.login.passwordPlaceholder')"
                autocomplete="current-password"
                :disabled="isLoading"
                :class="{
                  'border-red-500': password && !isPasswordValid,
                }"
                required
              />
            </Field>
            <Field>
              <Button
                :disabled="isLoading || !isUsernameValid || !isPasswordValid"
                type="submit"
              >
                <IconLucideLoader2
                  v-if="isLoading"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                {{ t("auth.login.submit") }}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
