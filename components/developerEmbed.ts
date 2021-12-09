import { MessageEmbed } from "discord.js";

export function createDeveloperEmbed(avatarURL: any, dev: any) : MessageEmbed {
    
    return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${dev.discord.charAt(0).toUpperCase() + dev.discord.slice(1)}'s profile`)
	.setThumbnail(avatarURL)
	.setDescription(dev.position)
    .addFields(
        {name: 'Skills', value: dev.skills}, 
        {name: 'Desired Skills', value: dev.desired_skills},
        {name: 'Goal', value: dev.goal ?? "none"},
        {name: 'Available', value: dev.available ? '✅' : '❌', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Timezone', value: dev.timezone.toUpperCase(), inline: true},
        {name: 'Github', value: `__[${dev.github}](https://github.com/${dev.github})__`, inline: true},
        {name: 'Twitter', value: `__[${dev.twitter}](https://twitter.com/${dev.twitter})__`, inline: true},
    )
}