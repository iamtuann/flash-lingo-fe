<template>
  <header class="p-2 -mx-2 h-16 bg-transparent relative flex items-center justify-between gap-2">
    <div class="relative z-[1]">
      <RouterLink to="" class="text-xl font-bold px-3 py-2">
        Flash Lingo
      </RouterLink>
    </div>
    <div class="flex flex-1 md:absolute inset-x-0 items-center justify-center">
      <Search />
    </div>
    <div class="relative z-[1] flex items-center gap-3 px-3">
      <template v-if="!authStore.isAuthenticated">
        <RouterLink
          :to="{name: 'Signup'}"
          :class="cn(buttonVariants({variant: 'secondary'}), 'px-5 text-white rounded-full')"
        >
          Sign up
        </RouterLink>
        <RouterLink
          :to="{name: 'Login'}"
          :class="cn(buttonVariants(), 'px-5 text-white rounded-full')"
        >
          Log in
        </RouterLink>
      </template>
      <Dialog v-model:open="dialogSaveTopic">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon" class="mr-1">
              <Plus class="!size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-48" :sideOffset="12" align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem class="pointer">
                <Shapes class="mr-2 h-4 w-4" />
                <span>Flashcard Topic</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem>
              <Folder class="mr-2 h-4 w-4" />
              <span>Folder</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent @interactOutside="(e) => {e.preventDefault()}">
          <DialogHeader>
            <DialogTitle>Create a new flashcard topic</DialogTitle>
          </DialogHeader>
          <SaveTopic @success="onCreateTopicSuccess" />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Avatar v-if="authStore.isAuthenticated" class="size-9 md:size-10 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer">
            <AvatarImage :src="user.avatarUrl" :alt="user.firstName+' '+user.lastName" />
            <AvatarFallback
              class="text-primary flex h-full w-full items-center justify-center bg-white font-bold" :delay-ms="600"
            >
              {{ user.firstName[0] + user.lastName[0] }}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" :sideOffset="12" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AuthResponse } from '@/types/auth';
import type { Topic } from '@/types/topic';
import { useAuthStore } from "@/stores";
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { buttonVariants, Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Folder, LogOut, Plus, Settings, Shapes, User } from 'lucide-vue-next';
import Search from '@/components/Search.vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useRouter } from 'vue-router';
import SaveTopic from './SaveTopic.vue';
import { ref } from 'vue';

const authStore = useAuthStore()
const router = useRouter()
let user:AuthResponse
if (authStore.isAuthenticated) {
  user = JSON.parse(localStorage.getItem('user') || '')
}
const dialogSaveTopic = ref(false)

function onCreateTopicSuccess(data: Topic) {
  dialogSaveTopic.value = false;
  router.push({name: 'EditFlashcards', params: {id: data.id}})
}

function handleLogout() {
  authStore.removeToken();
  router.push({name: 'Login'})
}

</script>

<style scoped>

</style>