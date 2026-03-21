import { ref, reactive, onMounted } from 'vue'
import type { Group } from '@/lib/groupData'
import { getAllGroups, addGroup, updateGroup, deleteGroup } from '@/lib/groupData'

export { type Group }

export function useGroupData() {
  const group_data = reactive<Group[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadGroups = async () => {
    isLoading.value = true
    error.value = null
    try {
      const groups = await getAllGroups()
      group_data.splice(0, group_data.length, ...groups)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      isLoading.value = false
    }
  }

  const add = async (group: Omit<Group, 'id'>) => {
    await addGroup(group)
    await loadGroups()
  }

  const update = async (group: Group) => {
    await updateGroup(group)
    await loadGroups()
  }

  const remove = async (id: number) => {
    await deleteGroup(id)
    await loadGroups()
  }

  onMounted(() => {
    loadGroups()
  })

  return {
    group_data,
    isLoading,
    error,
    loadGroups,
    add,
    update,
    remove
  }
}
