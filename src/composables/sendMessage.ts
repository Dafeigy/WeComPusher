import { fetch } from '@tauri-apps/plugin-http'

export interface SendMessageOptions {
  url: string
  text: string
}

export interface SendMessageResponse {
  errcode: number
  errmsg: string
}

export async function sendMessage({ url, text }: SendMessageOptions): Promise<SendMessageResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msgtype: 'text',
      text: {
        content: text,
      },
    }),
  })

  return await response.json() as SendMessageResponse
}
