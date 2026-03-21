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
import { toast } from 'vue-sonner'

const isEdit = ref(true)

const { group_data, add, remove, update, loadGroups } = useGroupData()

const router = useRouter()

const routeToHome = ()=> {
    router.push("/")
}

const handleDelete = async (group: Group) => {
  if (confirm(`确定要删除群组 "${group.name}" 吗？`)) {
    try {
      if (group.id) {
        await remove(group.id)
        toast.success('删除成功')
      }
    } catch (e) {
      toast.error('删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    for (const group of group_data) {
      if (group.id) {
        await update(group)
      }
    }
    toast.success('保存成功')
    isEdit.value = true
  } catch (e) {
    toast.error('保存失败')
  }
}

const handleAdd = async () => {
  const newGroup: Omit<Group, 'id'> = {
    name: '新群组',
    url: ''
  }
  try {
    await add(newGroup)
    toast.success('添加成功')
    await loadGroups()
  } catch (e) {
    toast.error('添加失败')
  }
}
</script>

<template>
    <div id="container" class="w-screen h-screen flex flex-col transition-all! duration-400">
        <header class="w-full h-16 flex items-center justify-start p-4">
            <div class="flex flex-col justify-start mx-1">
                <p class="text-2xl font-bold flex justify-start items-center"><Settings class="mr-2"/>偏好与设置</p>
                <p class="text-sm text-gray-400"></p>
            </div>
        </header>
        <div class="w-[90%] mx-4 py-2 flex items-center">
            <p class="text-md text-foreground/50 select-none px-2 ">群组管理</p>
            <Button variant="outline" size="icon-sm" @click="handleSave" v-if="!isEdit">
                <Save></Save>
            </Button>
            <Button variant="outline" size="icon-sm" @click="()=>isEdit = !isEdit" v-else>
                <Edit></Edit>
            </Button>
        </div>
        <div class="w-[90%] h-76! mx-4 py-2 scroll-hidden overflow-y-auto rounded-xl">
            <div class="flex px-4 w-full">
                <Table class="">
                    <TableHeader >
                    <TableRow>
                        
                        <TableHead>群聊名称</TableHead>
                        <TableHead >Webhook URL</TableHead>
                        <TableHead >操作</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(group,index) in group_data" :key="group.id ?? index">
                            
                            <TableCell class="font-medium"><Input type="text" v-model="group.name" :disabled="isEdit"></Input></TableCell>
                            <TableCell><Input v-model="group.url" type="password" :disabled="isEdit"></Input></TableCell>
                            <TableCell>
                                <Button size="icon-sm" variant="ghost" class="cursor-pointer" @click="handleDelete(group)" :disabled="isEdit">
                                    <Trash/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <!-- <TableRow> -->
                        <TableCell colspan="3" class="text-center">
                        <Button variant="outline" size="sm" @click="handleAdd"><p>新增群组</p><PlusCircle/></Button>
                        </TableCell>
                    <!-- </TableRow> -->
                </Table>
         </div>
        
        </div>
        
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