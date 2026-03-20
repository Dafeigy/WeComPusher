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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'vue-sonner'
import { Settings, Send, AtSign,History } from 'lucide-vue-next';

import { ref } from 'vue';
import { verify } from 'crypto';


const text_to_push = ref("")
const group_to_push = ref(["测试群A","测试群B","测试群C"])
const dialogOpen = ref(false)

const user_pwd = ref("")

const handle_submit = () => {
  if (text_to_push.value.length !== 0) {
    dialogOpen.value = true
  } else {
    // 使用 sonner 的 toast
    toast.error('错误', {
        description: '发版内容和发送群组不能为空',
        action: {
          label: '取消',
        },
      })
    
  }
}

const verify_pwd = ()=> {
    if (user_pwd.value == "123456"){
        toast.success('发送成功', {
        description: '推送任务已发起',
        duration:2000,
      })
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
    <div id="container" class="w-screen h-screen flex flex-col">
        <div id="header" class="px-4 w-full flex">
            logo
        </div>
        <div id="user" class="w-full p-4">
            <textarea name="userinput" id="userinput" rows="12" class="w-full border-1 rounded-md text-md p-2 resize-none"
            placeholder="输入发版内容..." v-model="text_to_push"></textarea>
        </div>
        <div id="control" class="w-full flex">
            <div id="navigation" class="w-1/2 px-4">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="mx-1/2 " size="sm" variant="ghost" ><Settings/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>设置</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="mx-1/2 " size="sm" variant="ghost"><History/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>发版历史</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="mx-1/2 " size="sm" variant="ghost"><AtSign/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>选择发送对象</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
            </div>
            <div id="send" class="w-1/2 flex justify-end px-4">
                <Button variant="outline" class="p-0 m-0" @click="handle_submit()">
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