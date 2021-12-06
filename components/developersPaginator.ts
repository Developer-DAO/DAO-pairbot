import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { client } from '../index';
import { createDeveloperEmbed } from '../utils/developerEmbed';

export async function generateDevelopersPaginator(interaction: any, developers: any[]) {
  let page = 0;
  const PAGE_RECORDS = 25;

  let totalDevelopers = developers!.length;
  const getCurrentPageDevs = (page: number): any[] => developers!.filter((elem, index, array) => {
    return index >= page * PAGE_RECORDS && index < page * PAGE_RECORDS + PAGE_RECORDS;
  })

  //Initializing settings ----- start
  
  const developerSelectOptions = _constructDeveloperOptions(getCurrentPageDevs(page))
  let embed = await _resolveCurrentEmbed(developers!, 0);
  let maxDeveloperSelections = Math.floor(totalDevelopers / PAGE_RECORDS);
  if (totalDevelopers % PAGE_RECORDS > 0) maxDeveloperSelections += 1;
  
  let menuPlaceholder = (discordTag: string, page: number) => 
    `Currently viewing ${discordTag} - page ${page + 1} of ${maxDeveloperSelections}`

  let selectMenu = new MessageSelectMenu()
  .setPlaceholder(menuPlaceholder(developers![0].discord, page))
  .setOptions(developerSelectOptions)
  .setCustomId('developer-list')
  .setMinValues(1)
  .setMaxValues(1);

  const startButton = new MessageButton()
  .setLabel('⏪')
  .setStyle('SECONDARY')
  .setCustomId('start-button');

  const firstFilterButton = new MessageButton()
  .setLabel(`-${PAGE_RECORDS}`)
  .setStyle('PRIMARY')
  .setCustomId(`filter-${PAGE_RECORDS}`);

  const secondFilterButton = new MessageButton()
  .setLabel(`+${PAGE_RECORDS}`)
  .setStyle('PRIMARY')
  .setCustomId(`filter+${PAGE_RECORDS}`);

  const endButton = new MessageButton()
  .setLabel('⏩')
  .setStyle('SECONDARY')
  .setCustomId('end-button');

  const menuList = [selectMenu];
  const buttonList = [startButton, firstFilterButton, secondFilterButton, endButton];
  const firstRow = new MessageActionRow().addComponents(buttonList);
  let secondRow = new MessageActionRow().addComponents(selectMenu);

  //Initializing settings ----- end

  const curPage = await interaction.reply({
    content: 'Here are all the developers in my pairing sheet!',
    embeds: [embed],
    components: [firstRow, secondRow],
    fetchReply: true,
    ephemeral: true
  });

  const filter = (i: any) => 
  i.customId === menuList[0].customId ||
  i.customId === buttonList[0].customId ||
  i.customId === buttonList[1].customId ||
  i.customId === buttonList[2].customId ||
  i.customId === buttonList[3].customId;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: 60000,
  })

  //Starts on listening for button component clicks
  collector.on("collect", async (i: any) => {
    if (i.isSelectMenu()) {
      embed = await _resolveCurrentEmbed(
        getCurrentPageDevs(page), 
        getCurrentPageDevs(page).findIndex((dev: any) => dev.discord_id === i.values[0])
        );
      let selectedDevDiscord = getCurrentPageDevs(page).find(dev => dev.discord_id === i.values[0]).discord;
      selectMenu.placeholder = menuPlaceholder(selectedDevDiscord, page)
    }

    if (i.isMessageComponent()){
      switch (i.customId) {
        case buttonList[0].customId:
          page = 0;
          break; 
        case buttonList[1].customId:
          page - 1 < 0 ? 0 : page--;
          break;
        case buttonList[2].customId:
          page + 1 >= maxDeveloperSelections ? maxDeveloperSelections : page++;
          break;
        case buttonList[3].customId:
          page = maxDeveloperSelections - 1;
          break; 
        }
      selectMenu.options = _constructDeveloperOptions(getCurrentPageDevs(page))
      selectMenu.placeholder = menuPlaceholder(embed.title!.replace("'s profile", ""), page)
      secondRow.components = [selectMenu];
    }
    
    await i.update({
      embeds: [embed],
      components: [firstRow, secondRow],
    });
    collector.resetTimer();
  });

  //Finishes listening and disable buttons
  collector.on("end", () => {
    if (!curPage.deleted) {
      const disabledMenu = new MessageActionRow().addComponents(
        menuList[0].setDisabled(true),
      );

      const disabledButtons = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true),
        buttonList[3].setDisabled(true)
      );

      interaction.editReply({
        embeds: [embed],
        components: [disabledMenu, disabledButtons],
      });
    }
  });
}

//Builds the embed of the current selected developer
async function _resolveCurrentEmbed(developers: any[], devIndex = 0) {
  let selectedDeveloper: any = developers!.find((value, index, array) => index === devIndex);
  let selectedDevId = await client.users.fetch(selectedDeveloper.discord_id);
  let embed = createDeveloperEmbed(selectedDevId.avatarURL() ?? selectedDevId.defaultAvatarURL, selectedDeveloper);
  return embed;   
}

//Builds the possible options in the dropdown
function _constructDeveloperOptions(developers: any): any[] {
  const developerOptions: { label: string; description: string, value: string; }[] = [];

  developers.forEach((dev: { discord: string, discord_id: string, available: boolean, timezone: string }) => {
      developerOptions.push({
      label: `#${`${developers.indexOf(dev)}`.padStart(4, '0')}  -  ${dev.discord}`,
      description: `Available: ${dev.available ? '✅' : '❌'} - Timezone: ${dev.timezone.toUpperCase()}`,
      value: dev.discord_id,
    });
  });
  return developerOptions;
}