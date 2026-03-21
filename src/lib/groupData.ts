import { invoke } from '@tauri-apps/api/core'

export interface Group {
  id?: number
  name: string
  url: string
}

export async function getAllGroups(): Promise<Group[]> {
  return invoke<Group[]>('get_all_groups')
}

export async function addGroup(group: Group): Promise<void> {
  return invoke<void>('add_group', { group })
}

export async function updateGroup(group: Group): Promise<void> {
  return invoke<void>('update_group', { group })
}

export async function deleteGroup(id: number): Promise<void> {
  return invoke<void>('delete_group', { id })
}
