<script setup lang="ts">
import { Button } from '@/components/ui/button'
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
import { PlusCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import type { Group } from '@/lib/groupData'
import { addGroup, getAllGroups } from '@/lib/groupData'

const emit = defineEmits<{
  added: []
}>()

const dialogOpen = ref(false)
const name = ref('')
const url = ref('')

const isValidUrl = (urlString: string): boolean => {
  try {
    const parsedUrl = new URL(urlString)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

const handleAdd = async (name: string, url: string) => {
  try {
    const existingGroups = await getAllGroups()
    
    const nameExists = existingGroups.some(g => g.name === name)
    if (nameExists) {
      toast.error('添加失败', { description: '群组名称已存在，请使用其他名称' })
      return
    }
    
    const urlExists = existingGroups.some(g => g.url === url)
    if (urlExists) {
      toast.error('添加失败', { description: 'Webhook URL 已存在，请勿重复添加' })
      return
    }
    
    if (!isValidUrl(url)) {
      toast.error('添加失败', { description: 'Webhook URL 必须以 http:// 或 https:// 开头' })
      return
    }
    
    const newGroup: Omit<Group, 'id'> = {
      name,
      url
    }
    
    await addGroup(newGroup)
    toast.success('添加成功')
    emit('added')
    dialogOpen.value = false
  } catch (e) {
    toast.error('添加失败', { description: e instanceof Error ? e.message : '未知错误' })
  }
}
</script>

<template>
  <Dialog @submit="handleAdd" v-model:open="dialogOpen">
    <form>
      <DialogTrigger as-child>
        <Button variant="outline" class="cursor-pointer" >
          <p>新增群组</p><PlusCircle/>
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增群组</DialogTitle>
          <DialogDescription>
            填写群组名称与Webhook URL。注意需要在企业微信中先创建群组，才能获取Webhook URL。
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="name-1"><p class="text-red-500 text-sm">*</p>群组名称</Label>
            <Input type="text" id="name-1" name="name" placeholder="群聊名称" v-model="name" required="true"/>
          </div>
          <div class="grid gap-3">
            <Label for="username-1"><p class="text-red-500 text-sm">*</p>Webhook URL</Label>
            <Input type="text" id="username-1" name="username" placeholder="请输入Webhook URL" v-model="url" required="true"/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" class="cursor-pointer">
              取消
            </Button>
          </DialogClose>
          <Button type="submit" class="cursor-pointer" @click="handleAdd(name, url)">
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
</template>
