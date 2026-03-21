<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useGroupData } from '@/composables/useGroupData'
import { ref } from 'vue'

const { group_data } = useGroupData()
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

import {AtSign} from 'lucide-vue-next';
import GroupItem from './GroupItem.vue'

const selectedGroups = ref<string[]>([])
const dialogOpen = ref(false)
const initialSelection = ref<string[]>([])

const emit = defineEmits<{
  update: [value: string[]]
}>()

const handleModelUpdate = (val: string[]) => {
  console.log('SelectGroup 收到 v-model 更新:', val)
  selectedGroups.value = val
}

const handleOpen = () => {
  initialSelection.value = [...selectedGroups.value]
}

const handleConfirm = () => {
  console.log('SelectGroup 准备发送:', selectedGroups.value)
  emit('update', selectedGroups.value)
  dialogOpen.value = false
}

const handleCancel = () => {
  selectedGroups.value = [...initialSelection.value]
  dialogOpen.value = false
}

</script>

<template>
  <Dialog v-model:open="dialogOpen" @update:open="(val) => val && handleOpen()">
    <form @submit.prevent>
      <DialogTrigger as-child>
        <Button variant="ghost">
          <AtSign />
        </Button>
      </DialogTrigger>
      <DialogContent class="max-w-lg w-[600px] min-w-[75%]"
                    @open-auto-focus="(e) => e.preventDefault()" 
                    @escape-key-down="(e) => {e.preventDefault()}"
                    @interact-outside="(e)=>{e.preventDefault()}"
      >
        <DialogHeader>
          <DialogTitle>选择发送对象</DialogTitle>
          <DialogDescription>
            在下方选择发送对象。如果没有找到对应群聊，请在设置界面查看或管理群聊信息。
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="group">群聊列表</Label>
            <div class="max-h-30 gap-1 flex justify-start items-center scroll-auto overflow-y-auto flex-wrap">
                <GroupItem 
                  v-for="item in group_data" 
                  :key="item.url" 
                  :group="item"
                  :model-value="selectedGroups"
                  @update:model-value="handleModelUpdate"
                />
            </div>
          </div>

        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" @click="handleCancel">
              取消
            </Button>
          </DialogClose>
          <Button @click="handleConfirm">
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
</template>
