import { invoke } from '@tauri-apps/api/core'

export async function isPasswordSet(): Promise<boolean> {
  return invoke<boolean>('is_password_set')
}

export async function setPassword(password: string): Promise<void> {
  return invoke<void>('set_password', { password })
}

export async function verifyPassword(password: string): Promise<boolean> {
  return invoke<boolean>('verify_password', { password })
}

export async function resetAllData(): Promise<void> {
  return invoke<void>('reset_all_data')
}
