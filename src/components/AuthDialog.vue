<template>
  <Dialog :open="showLoginDialog" @update:open="closeLoginDialog">
    <DialogContent @interactOutside="(e) => {e.preventDefault()}">
      <DialogHeader class="mb-4">
        <DialogTitle class="text-2xl font-semibold tracking-tight text-center">Login to continue studying</DialogTitle>
        <p class="text-sm text-muted-foreground text-center">
          Do not have an account?
          <RouterLink
            :to="{name: 'Signup'}"
            class="underline underline-offset-4 hover:text-primary"
          > Register </RouterLink>
        </p>
      </DialogHeader>
      
      <LoginForm @success="handleLoginSuccess" />

      <DialogFooter>
        <p class="px-8 text-center text-sm text-muted-foreground">
          By clicking Log in, you agree to our
          <RouterLink
            to=""
            class="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </RouterLink>
          and
          <RouterLink
            to=""
            class="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </RouterLink>
          .
        </p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from './LoginForm.vue';
import { useAuthGuard } from '@/composable/use-auth-guard';

const { showLoginDialog, closeLoginDialog } = useAuthGuard()

function handleLoginSuccess() {
  closeLoginDialog()
}
</script>

<style scoped>

</style>