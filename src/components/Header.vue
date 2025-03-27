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
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" class="mr-1">
            <Plus class="!size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48" :sideOffset="12" align="end">
          <DropdownMenuItem @select="(e) => {e.preventDefault(); dialogTopicForm = true}" >
            <Shapes class="mr-2 h-4 w-4" />
            <span>Flashcard Topic</span>
          </DropdownMenuItem>
          <DropdownMenuItem @select="(e) => {e.preventDefault(); dialogFolderForm = true}">
            <FolderIcon class="mr-2 h-4 w-4" />
            <span>Folder</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        

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
    <Dialog v-model:open="dialogTopicForm">
      <DialogContent @interactOutside="(e) => {e.preventDefault()}">
        <DialogHeader>
          <DialogTitle>Create a new Flashcard Topic</DialogTitle>
        </DialogHeader>
        <TopicForm @success="onCreateTopicSuccess" />
      </DialogContent>
    </Dialog>
    <Dialog v-model:open="dialogFolderForm">
      <DialogContent @interactOutside="(e) => {e.preventDefault()}">
        <DialogHeader>
          <DialogTitle>Create new Folder</DialogTitle>
        </DialogHeader>
        <FolderForm type="create" @success="onCreateFolderSuccess" />
      </DialogContent>
    </Dialog>
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
import { FolderIcon, LogOut, Plus, Settings, Shapes, User } from 'lucide-vue-next';
import Search from '@/components/Search.vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useRouter } from 'vue-router';
import TopicForm from '@/components/topic/TopicForm.vue';
import { FolderForm } from "@/components/folder";
import { ref } from 'vue';
import type { Folder } from '@/types';

const authStore = useAuthStore()
const router = useRouter()
let user:AuthResponse
if (authStore.isAuthenticated) {
  user = JSON.parse(localStorage.getItem('user') || '')
}
const dialogTopicForm = ref(false)
const dialogFolderForm = ref(false)

function onCreateTopicSuccess(data: Topic) {
  dialogTopicForm.value = false;
  router.push({name: 'TopicEdit', params: {id: data.id}})
}
function onCreateFolderSuccess(data: Folder) {
  dialogFolderForm.value = false;
  router.push({name: 'FolderTopics', params: {id: data.id, slug: data.slug}})
}

function handleLogout() {
  authStore.removeToken();
  router.push({name: 'Login'})
}

</script>

<style scoped>

</style>