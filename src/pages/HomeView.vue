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
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'vue-sonner'
import { Settings, Send, MessageSquareShare, BookImage, WandSparkles } from 'lucide-vue-next';

import { useRouter } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import { sendMessage } from '@/composables/sendMessage'
import { useGroupData } from '@/composables/useGroupData'
import { isPasswordSet, setPassword, verifyPassword } from '@/composables/auth'

const router = useRouter();
const { group_data } = useGroupData()

const text_to_push = ref("")
const group_to_push = ref<string[]>([])
const dialogOpen = ref(false)

const user_pwd = ref("")
const atAllPrefenrece = ref(false)
const GROUP_STORAGE_KEY = 'wecomx_group_to_push'

const isNewsMode = ref(false)
const newsArticle = ref({
  title: "",
  description: "",
  url: "",
  picurl: ""
})

const isPasswordSetFlag = ref(false)
const showSetPasswordDialog = ref(false)
const new_password = ref("")
const confirm_password = ref("")

const getGroupNameByUrl = (url: string) => {
  const group = group_data.find(g => g.url === url)
  return group ? group.name : url
}

onMounted(async () => {
  const saved = localStorage.getItem(GROUP_STORAGE_KEY)
  if (saved) {
    try {
      group_to_push.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse saved groups:', e)
    }
  }
  
  try {
    isPasswordSetFlag.value = await isPasswordSet()
    if (!isPasswordSetFlag.value) {
      showSetPasswordDialog.value = true
    }
  } catch (e) {
    console.error('Failed to check password status:', e)
  }
})

watch(group_to_push, (newVal) => {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const handleSettingsButtonClick = ()=>{
    router.push('/settings')
}

const handleGroupUpdate = (val: string[]) => {
  console.log('选中的群组:', val)
  group_to_push.value = val
}

const toggleNewsMode = () => {
  isNewsMode.value = !isNewsMode.value
}

const isValidImageUrl = (url: string): string => {
  if (!url || url.trim() === '') {
    return 'https://dummyimage.com/300x200/3f3f3f/fff&text=170px*417px'
  }
  
  try {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(url)) {
      return 'https://dummyimage.com/300x200/3f3f3f/fff&text=170px*417px'
    }
    
    return url
  } catch (e) {
    return 'https://dummyimage.com/300x200/3f3f3f/fff&text=170px*417px'
  }
}

const handle_submit = () => {
  if (isNewsMode.value) {
    if (!newsArticle.value.title || !newsArticle.value.description || !newsArticle.value.url) {
      toast.error('错误', {
        description: '图文链接模式下，标题、描述和链接不能为空。',
        duration: 2000,
        action: {
          label: '取消',
        },
      })
      return
    }
  } else {
    if (text_to_push.value.length === 0) {
      toast.error('错误', {
        description: '群发内容不能为空。',
        duration: 2000,
        action: {
          label: '取消',
        },
      })
      return
    }
  }
  
  if (group_to_push.value.length === 0) {
    toast.error('错误', {
      description: '发送群组不能为空。',
      duration: 2000,
      action: {
        label: '取消',
      },
    })
    return
  }
  
  dialogOpen.value = true
}


const send_group_message = async () => {
    let successCount = 0
    let failCount = 0
    
    for (const group of group_to_push.value) {
        let messageData: any = {
            url: group,
            isAtAll: atAllPrefenrece.value
        }
        
        if (isNewsMode.value) {
            messageData.msgtype = 'news'
            messageData.news = {
                articles: [{
                    title: newsArticle.value.title,
                    description: newsArticle.value.description,
                    url: newsArticle.value.url,
                    picurl: newsArticle.value.picurl
                }]
            }
        } else {
            messageData.text = text_to_push.value
        }
        
        try {
            const res = await sendMessage(messageData)
            if (res.errcode !== 0){
                failCount++
                console.error(`发送失败 ${group}:`, res.errmsg)
            }
            else{
                successCount++
            }
            console.log(res)
        } catch (e) {
            failCount++
            console.error(`发送异常 ${group}:`, e)
        }
    }
    
    if (failCount === 0) {
        toast.success('发送完成', {
            description: `成功发送 ${successCount} 个群聊`,
            duration: 2000,
        })
    } else {
        toast.error('发送完成', {
            description: `成功 ${successCount} 个，失败 ${failCount} 个`,
            duration: 2000,
        })
    }
}

const verify_pwd = async ()=> {
    if (!isPasswordSetFlag.value) {
        toast.error('错误', {
            description: '请先设置管理员密码',
            duration: 2000,
        })
        return
    }
    
    try {
        const isValid = await verifyPassword(user_pwd.value)
        if (isValid) {
            toast.success('已发起推送任务', {
                description: '推送任务已发起',
                duration: 2000,
            })
            user_pwd.value = ''
            send_group_message()
            dialogOpen.value = false
        } else {
            user_pwd.value = ''
            toast.error('错误', {
                description: '密码输入错误',
                duration: 2000,
            })
        }
    } catch (e) {
        console.error('Password verification failed:', e)
        user_pwd.value = ''
        toast.error('错误', {
            description: '密码验证失败',
            duration: 2000,
        })
    }
}

const handleSetPassword = async () => {
    if (new_password.value.length === 0) {
        toast.error('错误', {
            description: '密码不能为空',
            duration: 2000,
        })
        return
    }
    
    if (new_password.value !== confirm_password.value) {
        toast.error('错误', {
            description: '两次输入的密码不一致',
            duration: 2000,
        })
        return
    }
    
    try {
        await setPassword(new_password.value)
        isPasswordSetFlag.value = true
        showSetPasswordDialog.value = false
        new_password.value = ''
        confirm_password.value = ''
        toast.success('密码设置成功', {
            description: '密码已设置，请牢记您的密码',
            duration: 3000,
        })
    } catch (e) {
        console.error('Failed to set password:', e)
        toast.error('错误', {
            description: '密码设置失败',
            duration: 2000,
        })
    }
}

</script>
<template>
    <div id="container" class="w-screen h-screen flex flex-col transition-all! duration-400! ease-in-out! items-center">
        <header class="w-full h-16 flex items-center justify-start p-4">
            <div class="flex flex-col justify-start mx-1 ">
                <p class="text-2xl font-bold flex justify-start items-center text-blue-400"><MessageSquareShare class="mr-2 text-blue-400"/>WecomX</p>
                <p class="text-sm text-gray-400">一键帮你群发企业微信消息</p>
            </div>
        </header>
        <div id="user" class="w-[95%] rounded-xl h-76 flex border  flex-col">
            <div class="h-[1ch] text-md"></div>
            <Transition name="fade" mode="out-in">
                <template v-if="!isNewsMode">
                    <textarea name="userinput" id="userinput" class="h-full w-full text-md resize-none px-[1ch] text-primary/72"
                    placeholder="输入群发内容..." v-model="text_to_push"></textarea>
                </template>
                <template v-else>
                    <div class="h-full w-full px-[1ch] flex items-center justify-between">
                        <div class="grid grid-cols-1 gap-2 mt-[1ch] px-2">
                            <div class="flex">
                            <Label>推文标题</Label>
                            <Input 
                            type="text"
                            v-model="newsArticle.title" 
                            placeholder="标题（必填）" 
                            class="text-md mx-2"
                        />
                        </div>
                        
                        <div class="flex">
                            <Label>推文简介 </Label>
                            <Input 
                            type="text"
                            v-model="newsArticle.description" 
                            placeholder="描述（必填）" 
                            class="text-md mx-2"
                        />
                        </div>
                        
                        <div class="flex">
                            <Label>推文链接</Label>
                            <Input 
                            type="text"
                            v-model="newsArticle.url" 
                            placeholder="跳转链接（必填）" 
                            class="text-md mx-2"
                        />
                        </div>
                        
                        <div class="flex">
                            <Label>封面 URL</Label>
                            <Input 
                            type="text"
                            v-model="newsArticle.picurl" 
                            placeholder="图片链接（可选）" 
                            class="text-md mx-2"
                        />
                        </div>
                        </div>
                        <div class="rounded-lg bg-secondary w-[50%] flex flex-col overflow-hidden z-40 top-[calc(1ch+1rem)] relative">
                            <img :src="isValidImageUrl(newsArticle.picurl)" alt="" srcset="" class="max-h-[170px] w-full h-[170px]">
                            <p class="text-lg px-2 py-1">{{ newsArticle.title.length==0?'无标题':newsArticle.title }}</p>
                            <p class="text-sm text-primary/80 p-2">{{ newsArticle.description.length==0?'无简介':newsArticle.description }}</p>
                        </div>  
                    </div>
                </template>
            </Transition>
            <div class="z-25 select-none p-[1ch]">
                <TooltipProvider class="modeToggle">
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="cursor-pointer mx-1 rounded-2xl" variant="outline" @click="toggleNewsMode">
                            <BookImage class="w-2 h-2"/>
                            <p class="text-xs">{{ isNewsMode ? '文字编辑模式' : '图文编辑模式' }}</p>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>切换至图文链接编辑模式，<br>类似推文推送。</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider class="AIHelpWrite">
                    <Tooltip>
                    <TooltipTrigger>
                        <Button class="cursor-pointer mx-1 rounded-2xl" disabled variant="outline"><WandSparkles class="w-2 h-2"/><p class="text-xs">AI 帮写</p></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>开发 ing...</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
            </div>
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
                        <SelectGroup v-model="group_to_push" @update="handleGroupUpdate"></SelectGroup>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>选择发送对象：{{ group_to_push.length }}个</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
            </div>
            <div id="send" class="w-1/2 flex justify-end px-4 mx-[1ch]">
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
                                    {{ isNewsMode ? '图文链接' : '发版信息' }}
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <template v-if="isNewsMode">
                                    <p>标题：{{newsArticle.title}}</p>
                                    <p>描述：{{newsArticle.description}}</p>
                                    <p>链接：{{newsArticle.url}}</p>
                                </template>
                                <template v-else>
                                    <p>{{text_to_push}}</p>
                                </template>
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
                                <p v-for="value in group_to_push">{{ getGroupNameByUrl(value) }}</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>中
                        </DialogDescription>
                        <Label v-if="!isNewsMode"><Checkbox v-model="atAllPrefenrece" label="@所有人" />@所有人</Label>
                        
                    </DialogHeader>
                    <div class="flex items-center gap-2">
                        <div class="grid flex-1 gap-2">
                        <Label for="pwd" class="sr-only select-none">
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
                        <Button type="button" variant="secondary" @click="()=>user_pwd = ''">
                            取消
                        </Button>
                        </DialogClose>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                <Dialog 
                    v-model:open="showSetPasswordDialog"
                    :close-on-escape="false"
                    :close-on-overlay-click="false"
                >
                    <DialogContent class="sm:max-w-md"
                    @open-auto-focus="(e) => e.preventDefault()"
                    @escape-key-down="(e) => {e.preventDefault()}"
                    @interact-outside="(e)=>{e.preventDefault()}"
                    >
                        <DialogHeader>
                            <DialogTitle>首次使用 - 设置管理员密码</DialogTitle>
                            <DialogDescription>
                                欢迎使用 WecomX！首次使用时，请设置管理员密码以保护您的操作安全。
                            </DialogDescription>
                        </DialogHeader>
                        <div class="flex flex-col gap-4 py-4">
                            <div class="grid gap-2">
                                <Label for="new-pwd">新密码</Label>
                                <Input 
                                    type="password" 
                                    id="new-pwd" 
                                    v-model="new_password" 
                                    placeholder="请输入密码"
                                />
                            </div>
                            <div class="grid gap-2">
                                <Label for="confirm-pwd">确认密码</Label>
                                <Input 
                                    type="password" 
                                    id="confirm-pwd" 
                                    v-model="confirm_password" 
                                    placeholder="请再次输入密码"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="default" @click="handleSetPassword">
                                设置密码
                            </Button>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>