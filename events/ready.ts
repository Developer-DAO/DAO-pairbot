
import { Client } from 'discord.js';

export const name = 'ready';
export const once = true;

export const ReadyEvent: any = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    if (client.user) {
        client.user.setActivity('people build together', { type: 'WATCHING' });
        client.user.setStatus('online');
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
  },
}