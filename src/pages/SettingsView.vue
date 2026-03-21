<script setup lang="ts">
import { Settings, ArrowLeft, PlusCircle, Edit } from 'lucide-vue-next';
import Separator from '@/components/ui/separator/Separator.vue';
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/input/Input.vue';
import { ref, reactive } from 'vue';
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

const isEdit = ref(true)

const group_data = reactive([
  {
    name: '今天晚上吃什么-大家讨论',
    url: 'https://example.com/s11234123aasd2q2345q12',
    tags: '测试',

  },
  {
    name: 'PDD助力砍一刀',
    url: 'https://example.com/s1ybo2938yro12983iyro9182h3broiu',
    tags: '测试',
  },
  {
    name: '工作内部交流群',
    url: 'https://example.com/sq1234v9rt8yaw8oueyro2r5qwerfqwe',
    tags: '测试',

  },
  {
    name: '项目讨论大群',
    url: 'https://example.com/s09a8hwydeifouygo 2ieufycgoaiw',
    tags: '测试',

  }
])


const router = useRouter()

const routeToHome = ()=> {
    router.push("/")
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
            <p class="text-md text-foreground/50 select-none px-2 ">群组管理</p><Button variant="outline" size="icon-sm" @click="()=>isEdit = !isEdit"><Edit/></Button>
        </div>
        <div class="w-[90%] h-76! mx-4 py-2 scroll-hidden overflow-y-auto rounded-xl">
            <div class="flex px-4 w-full">
                <Table class="">
                    <TableHeader >
                    <TableRow>
                        <TableHead>群聊名称</TableHead>
                        <TableHead >URL</TableHead>
                        <TableHead>标签</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="group in group_data" :key="group.name">
                            <TableCell class="font-medium"> <Input v-model="group.name" :disabled="isEdit"></Input></TableCell>
                            <TableCell><Input v-model="group.url" type="password" :disabled="isEdit"></Input></TableCell>
                            <TableCell><Input v-model="group.tags" :disabled="isEdit"></Input></TableCell>
                        </TableRow>
                    </TableBody>
                    <!-- <TableFooter> -->
                        <TableRow>
                        <TableCell colspan="4" class="text-center">
                        <Button variant="outline" size="sm"><p>新增群组</p><PlusCircle/></Button>
                        </TableCell>
                    </TableRow>
                    <!-- </TableFooter> -->
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