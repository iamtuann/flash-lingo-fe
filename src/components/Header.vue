<template>
  <div>
    <header class="px-2 py-3 -mx-2 h-16 sm:h-[72px] bg-transparent relative flex items-center justify-between gap-2">
      <div class="relative z-[1]">
        <RouterLink :to="{name: 'Home'}" class="flex items-center gap-1 text-xl font-bold sm:px-2 py-1">
          <img class="block h-9 sm:h-14" src="@/assets/images/logo.png" alt="logo">
          Flash Lingo
        </RouterLink>
      </div>
      <div class="hidden sm:flex flex-1 md:absolute inset-x-0 items-center justify-center">
        <Search />
      </div>
      <div class="relative z-[1] flex items-center gap-3 px-0 sm:px-3">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink
            :to="{name: 'Signup'}"
            :class="cn(buttonVariants({variant: 'secondary'}), 'px-5 rounded-full')"
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
        <template v-else>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button size="icon" class="mr-1 rounded-full">
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
        </template v-else>
          
  
        <DropdownMenu v-if="user">
          <DropdownMenuTrigger as-child>
            <Avatar class="border size-9 md:size-10 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer">
              <AvatarImage :src="user?.avatarUrl || ''" :alt="user.firstName+' '+user.lastName" />
              <AvatarFallback
                class="text-primary flex h-full w-full items-center justify-center dark:bg-white font-bold" :delay-ms="600"
              >
                {{ user.firstName[0] + user.lastName[0] }}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" :sideOffset="12" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem @click="router.push({name: 'UserProfile', params: {id: user.id}})">
                <UserIcon class="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="router.push({name: 'SettingProfile'})">
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
    <div class="flex justify-center px-3 -mt-1 sm:hidden gap-2">
      <slot name="prepend-mobile" />
      <Search />
    </div>
  </div>
</template>

<script setup lang="ts">
// import type { AuthResponse, User } from '@/types/auth';
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
import { FolderIcon, LogOut, Plus, Settings, Shapes, UserIcon } from 'lucide-vue-next';
import Search from '@/components/Search.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useRouter } from 'vue-router';
import TopicForm from '@/components/topic/TopicForm.vue';
import { FolderForm } from "@/components/folder";
import { ref } from 'vue';
import type { Folder } from '@/types';
import { useSessionTracker } from '@/composable';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const router = useRouter()
const {endSession} = useSessionTracker()
const { user } = storeToRefs(authStore)

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
  endSession()
  authStore.logout()
  router.push({name: 'Login'})
}

</script>

<style scoped>

</style>