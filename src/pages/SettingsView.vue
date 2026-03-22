<script setup lang="ts">
import { Settings, ArrowLeft, PlusCircle, Edit, Trash, Save } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/input/Input.vue';
import { ref } from 'vue';
import { useGroupData, type Group } from '@/composables/useGroupData'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import AddGroupItem from '@/components/AddGroupItem.vue'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const isEdit = ref(true)

const { group_data, add, remove, loadGroups, saveAllGroups } = useGroupData()

const router = useRouter()

const routeToHome = ()=> {
    router.push("/")
}

const deleteDialogOpen = ref(false)
const groupToDelete = ref<Group | null>(null)

const handleDelete = async (group: Group) => {
  groupToDelete.value = group
  deleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!groupToDelete.value?.id) return
  
  try {
    await remove(groupToDelete.value.id)
    toast.success('删除成功')
    deleteDialogOpen.value = false
    groupToDelete.value = null
  } catch (e) {
    toast.error('删除失败')
  }
}

const handleSave = async () => {
  const result = await saveAllGroups(group_data)
  if (result.success) {
    toast.success('保存成功')
    isEdit.value = true
  } else {
    toast.error(result.error ?? '保存失败')
  }
}

const toggleEditMode = () => {
  isEdit.value = !isEdit.value
}
</script>

<template>
    <div id="container" class="w-screen h-screen flex flex-col transition-all! duration-400">
        <header class="w-full h-16 flex items-center justify-start p-4">
            <div class="flex flex-col justify-start mx-1">
                <p class="text-2xl font-bold flex justify-start items-center"><Settings class="mr-2 select-none"/>偏好与设置</p>
                <p class="text-sm text-gray-400"></p>
            </div>
        </header>
        <div class="w-[90%] mx-4 py-2 flex items-center">
            <p class="text-md text-foreground/50 select-none px-2 ">群组管理</p>
            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger>
                    <Button variant="outline" size="icon-sm" @click="handleSave" v-if="!isEdit">
                        <Save class=""></Save>
                    </Button>
                    <Button variant="outline" size="icon-sm" @click="toggleEditMode" v-else>
                        <Edit></Edit>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p v-if="!isEdit">保存</p>
                    <p v-else>编辑</p>
                </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
        </div>
        <div class="w-[90%] h-76! mx-4 py-2 scroll-hidden overflow-y-auto rounded-xl" >
            <div class="flex px-4 w-full">
                <Table class="">
                    <TableHeader >
                    <TableRow>
                        
                        <TableHead>群聊名称</TableHead>
                        <TableHead >Webhook URL</TableHead>
                        <TableHead v-if="!isEdit">操作</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(group,index) in group_data" :key="group.id ?? index">
                            
                            <TableCell class="font-medium"><Input type="text" v-model="group.name" :disabled="isEdit"></Input></TableCell>
                            <TableCell><Input v-model="group.url" type="password" :disabled="isEdit"></Input></TableCell>
                            <TableCell v-if="!isEdit">
                                <Button size="icon-sm" variant="ghost" class="cursor-pointer" @click="handleDelete(group)" :disabled="isEdit">
                                    <Trash class="text-red-400"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <!-- <TableRow> -->
                        <TableCell colspan="3" class="text-center" :class="{'hidden':isEdit}">
                            <AddGroupItem @added="loadGroups"></AddGroupItem>
                        </TableCell>
                    <!-- </TableRow> -->
                </Table>
         </div>
        
        </div>
        <!-- Split -->
        <div class="w-full flex px-4 h-12 mb-1">
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
                <Button class="mx-1/2 " size="sm" variant="ghost" @click="routeToHome"><ArrowLeft/></Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>返回</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        </div>  

        <Dialog v-model:open="deleteDialogOpen">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除群组</DialogTitle>
              <DialogDescription>
                确定要删除群组 "{{ groupToDelete?.name }}" 吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
              <Button variant="destructive" @click="confirmDelete">删除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.15s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

::-webkit-scrollbar {
  height: 6px;
  margin: 0 12px;
}
::-webkit-scrollbar-track {
  background-color: #2a2b2d;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}

* {  
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.2s ease;
}
*:hover {  
  scrollbar-color: #d3d3d345 transparent;
}
</style>