<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DLButton from '@/components/general/ToggleLightDarkButton.vue'
import SelectGroup from '@/components/SelectGroup.vue';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'vue-sonner'
import { Settings, Send, MessageSquareShare } from 'lucide-vue-next';

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { sendMessage } from '@/composables/sendMessage'

const router = useRouter();

const text_to_push = ref("")
const group_to_push = ref<string[]>([])
const dialogOpen = ref(false)

const user_pwd = ref("")

const handleSettingsButtonClick = ()=>{
    router.push('/settings')
}

const handleGroupUpdate = (val: string[]) => {
  console.log('选中的群组:', val)
  group_to_push.value = val
}

const handle_submit = () => {
  if (text_to_push.value.length !== 0 && group_to_push.value.length !== 0) {
    dialogOpen.value = true
  } else {
    // 使用 sonner 的 toast
    toast.error('错误', {
        description: '群发内容和发送群组不能为空。',
        duration: 2000,
        action: {
          label: '取消',
        },
      })
    
  }
}


const send_group_message = async () => {
    for (const group of group_to_push.value) {
        const res = await sendMessage({
            url: group,
            text: text_to_push.value,
        })
        if (res.errcode !== 0){
            toast.error('错误', {
            description: res.errmsg,
            duration:2000,
          })
        }
        else{
            toast.success('发送成功', {
            description: '发送成功',
            duration:2000,
          })
        }
        console.log(res)
    }
}

const verify_pwd = ()=> {
    if (user_pwd.value == "123456"){
        toast.success('发送成功', {
        description: '推送任务已发起',
        duration:2000,
      })
      send_group_message()
      dialogOpen.value = false
    }
    else{
        toast.error('错误', {
        description: '密码输入错误',
        duration:2000,
      })
    }
}

</script>
<template>
    <div id="container" class="w-screen h-screen flex flex-col transition-all! duration-400! ease-in-out!">
        <header class="w-full h-16 flex items-center justify-start p-4">
            <div class="flex flex-col justify-start mx-1 ">
                <p class="text-2xl font-bold flex justify-start items-center"><MessageSquareShare class="mr-2"/>WecomX</p>
                <p class="text-sm text-gray-400">一键帮你群发企业微信消息</p>
            </div>
        </header>
        <div id="user" class="w-full px-4 py-2 h-76">
            <textarea name="userinput" id="userinput" class="h-full w-full border rounded-md text-md p-4 resize-none"
            placeholder="输入群发内容..." v-model="text_to_push"></textarea>
        </div>
        <div id="control" class="w-full flex h-12 items-center mb-0">
            <div id="navigation" class="w-1/2 px-4">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="mx-1/2 " size="sm" variant="ghost" @click="handleSettingsButtonClick"><Settings/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>设置</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DLButton></DLButton>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <SelectGroup @update="handleGroupUpdate"></SelectGroup>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>选择发送对象：{{ group_to_push.length }}个</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
            </div>
            <div id="send" class="w-1/2 flex justify-end px-4">
                <Button variant="default" class="p-0 m-0" @click="handle_submit()">
                    <Send/>推送
                </Button>
                <Dialog 
                    v-model:open="dialogOpen" 
                    :close-on-escape="false"
                    :close-on-overlay-click="false"
                    >
                    <DialogContent class="sm:max-w-md" 
                    @open-auto-focus="(e) => e.preventDefault()" 
                    @escape-key-down="(e) => {e.preventDefault()}"
                    @interact-outside="(e)=>{e.preventDefault()}"
                    >
                    <DialogHeader>
                        <DialogTitle>推送至企业微信群聊</DialogTitle>
                        <DialogDescription>
                        即将把
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger as-child>
                                <a class="underline underline-offset-4 text-primary select-none">
                                    发版信息
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{text_to_push}}</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        推送至
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger as-child>
                                <a class="underline underline-offset-4 text-primary select-none">
                                {{ group_to_push.length }}个群聊
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p v-for="value in group_to_push">{{value}}</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>中
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex items-center gap-2">
                        <div class="grid flex-1 gap-2">
                        <Label for="pwd" class="sr-only">
                            Link
                        </Label>
                        <Input type="password" id="pwd" v-model="user_pwd" placeholder="请输入管理员密码"/>
                        </div>
                    </div>
                    <DialogFooter class="sm:justify-start">
                        <Button type="button" variant="default" @click="verify_pwd()">
                            确认
                        </Button>
                        <DialogClose as-child>
                        <Button type="button" variant="secondary">
                            取消
                        </Button>
                        </DialogClose>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </div>
</template>


<style scoped>
textarea{
    outline: none
}
</style>