import { Client } from 'discord.js';
import fs from 'fs';


export class discordClient extends Client {
    [key: string]: any
    
    async loadCommandsToClient() {
        const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = await import(`${__dirname}/../commands/${file}`);
            this.commands.set(command.data.name, command)
        }
    }

    async loadEventsToClient() {
        const eventFiles = fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = await import(`${__dirname}/../events/${file}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args))
            }
            else {
                this.on(event.name, (...args) => event.execute(...args))
            }
        }
    }
    
}