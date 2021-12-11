import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { client } from '../index';
import { createDeveloperEmbed } from './developerEmbed';

export async function generateDevelopersPaginator(interaction: any, developers: any[]) {
  let page = 0;
  let currentFilter = filterTypes.AVAILABLE;
  const PAGE_RECORDS = 25;

  const getDevsByFilter = (filter: filterTypes): any[] => {
    if (filter == null) return developers;

    let filteredDevs = [];
    switch (filter) {
      case filterTypes.ALL:
        filteredDevs = developers;
        break;
      case filterTypes.AVAILABLE:
        filteredDevs = developers.filter((dev) => { return dev.available == true });
        break;
      default:
        return developers;
    }
    return filteredDevs;
  };

  const getCurrentPageDevs = (page: number): any[] => {
    let getDevs = getDevsByFilter(currentFilter).filter((_, index) => {
      let result = index >= page * PAGE_RECORDS && index < page * PAGE_RECORDS + PAGE_RECORDS;
      return result;
    });
    return getDevs;
  }

  const getMaxPages = () : number => {
    let maxDeveloperSelections = Math.floor(getDevsByFilter(currentFilter).length / PAGE_RECORDS);
    if (getDevsByFilter(currentFilter).length % PAGE_RECORDS > 0) maxDeveloperSelections += 1;
    return maxDeveloperSelections;
  }
  //Initializing settings ----- start
  
  //Dropdown options
  const developerSelectOptions = _constructDeveloperOptions(getCurrentPageDevs(page))
  const filterSelectOptions = _constructFilterOptions()

  let bEmbedNotFound = false
  let embed: MessageEmbed;
  if (getCurrentPageDevs(page).length !== 0) {
    embed = await _resolveCurrentEmbed(getCurrentPageDevs(page), 0)
  } else {
    bEmbedNotFound = true;
    embed = new MessageEmbed()
    .setTitle(`No developers found for the current filter: ${currentFilter.toUpperCase()}`)
    .setDescription('----------------------------------------------')
  }
  
  let setMenuPlaceholder = (discordTag: string | null, page: number) => 
    discordTag != null ? 
    `Currently viewing ${discordTag.charAt(0).toUpperCase() + discordTag.slice(1)} - page ${page + 1} of ${getMaxPages()}` :
    `Select a developer!`

  let setFilterPlaceholder = (filter: string | null) => {
    return filter != null ? `Filtered by ${filter}` : `Filtered by AVAILABLE`
  }
    
  let filterMenu = new MessageSelectMenu()
  .setPlaceholder(setFilterPlaceholder(null))
  .setOptions(filterSelectOptions)
  .setCustomId('developer-list-filters')
  .setMinValues(1)
  .setMaxValues(1);

  let selectMenu = new MessageSelectMenu()
  .setPlaceholder(bEmbedNotFound ? setMenuPlaceholder(null, page) : setMenuPlaceholder(getCurrentPageDevs(page)[0].discord, page))
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

  const buttonList = [startButton, firstFilterButton, secondFilterButton, endButton];
  let firstRow = new MessageActionRow().addComponents(filterMenu);
  let secondRow = new MessageActionRow().addComponents(selectMenu);
  const thirdRow = new MessageActionRow().addComponents(buttonList);
  
  //Initializing settings ----- end
  
  var components = [firstRow]
  if (getCurrentPageDevs(page).length !== 0) components.push(secondRow)
  components.push(thirdRow)

  const curPage = await interaction.reply({
    content: 'Here are all the developers in my pairing sheet!',
    embeds: [embed],
    components: components,
    fetchReply: true,
    ephemeral: true
  });

  const filter = (i: any) => 
  i.customId === selectMenu.customId ||
  i.customId === filterMenu.customId ||
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
      switch (i.customId) {

        //filterMenu
        case filterMenu.customId:
          let oldFilter = currentFilter;
          currentFilter = i.values[0];
          if (oldFilter != currentFilter) {
            selectMenu.placeholder = bEmbedNotFound ? setMenuPlaceholder(null, page) : setMenuPlaceholder(embed.title!.replace("'s profile", ""), page)
          }
          selectMenu.options = _constructDeveloperOptions(getCurrentPageDevs(page))
          filterMenu.placeholder = setFilterPlaceholder(currentFilter);
          if (getCurrentPageDevs(page).length === 0) {
            filterMenu.placeholder = setFilterPlaceholder(currentFilter + ' - No developers found!')
          }
          firstRow.components = [filterMenu];
          secondRow.components = [selectMenu]
          break;
        
        //selectMenu
        case selectMenu.customId:
          bEmbedNotFound = false
          embed = await _resolveCurrentEmbed(
            getCurrentPageDevs(page), 
            getCurrentPageDevs(page).findIndex((dev: any) => dev.discord_id === i.values[0])
          );
          let selectedDevDiscord = getCurrentPageDevs(page).find(dev => dev.discord_id === i.values[0]).discord;
          selectMenu.placeholder = setMenuPlaceholder(selectedDevDiscord, page)
          break;
      }
    }

    if (i.isButton()){
      switch (i.customId) {
        case buttonList[0].customId:
          page = 0;
          break; 
        case buttonList[1].customId:
          page - 1 < 0 ? 0 : page--;
          break;
        case buttonList[2].customId:
          page + 1 >= getMaxPages() ? getMaxPages() : page++;
          break;
        case buttonList[3].customId:
          page = getMaxPages() - 1;
          break; 
      }
      selectMenu.options = _constructDeveloperOptions(getCurrentPageDevs(page))
      selectMenu.placeholder = embed.title!.includes("No developers found for the current filter") ? 
        setMenuPlaceholder(null, page) :
        setMenuPlaceholder(embed.title!.replace("'s profile", ""), page)
        
      secondRow.components = [selectMenu];
    }
    
    components = [firstRow]
    if (getCurrentPageDevs(page).length !== 0) components.push(secondRow)
    components.push(thirdRow)

    await i.update({
      embeds: [embed],
      components: components,
    });
    collector.resetTimer();
  });

  //Finishes listening and disable buttons
  collector.on("end", () => {
    if (!curPage.deleted) {
      const disabledFilteredMenu = new MessageActionRow().addComponents(
        filterMenu.setDisabled(true)
      )

      const disabledButtons = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true),
        buttonList[3].setDisabled(true)
      );

      let disabledComponents = [disabledFilteredMenu]
      if (components[1].components[0].customId == selectMenu.customId) {
        const disabledSelectedMenu = new MessageActionRow().addComponents(
          selectMenu.setDisabled(true)
        );
        disabledComponents.push(disabledSelectedMenu)
      }
      disabledComponents.push(disabledButtons)

      interaction.editReply({
        embeds: [embed],
        components: disabledComponents,
      });
    }
  });
}

//Builds the embed of the current selected developer
async function _resolveCurrentEmbed(developers: any[], devIndex = 0) {
  let selectedDeveloper: any = developers!.find((_, index) => index === devIndex);
  let selectedDevId = await client.users.fetch(selectedDeveloper.discord_id);
  let embed = createDeveloperEmbed(selectedDevId.avatarURL() ?? selectedDevId.defaultAvatarURL, selectedDeveloper);
  return embed;   
}

//Builds the possible options in the developers dropdown
function _constructDeveloperOptions(developers: any): any[] {
  const developerOptions: { label: string; description: string, value: string; }[] = [];

  developers.forEach((dev: { discord: string, discord_id: string, available: boolean, timezone: string }) => {
      developerOptions.push({
      label: `#${`${developers.indexOf(dev)}`.padStart(4, '0')}  -  ${dev.discord.charAt(0).toUpperCase() + dev.discord.slice(1)}`,
      description: `Available: ${dev.available ? '✅' : '❌'} - Timezone: ${dev.timezone.toUpperCase()}`,
      value: dev.discord_id,
    });
  });
  return developerOptions;
}

//Builds the possible options in the filter dropdown
function _constructFilterOptions(): any[] {
  const filterOptions: { label: string; description: string, value: string; }[] = [];
  
  for (let type in filterTypes)
    filterOptions.push({
      label: `${type}`,
      description: type === 'AVAILABLE' ? `✅` : `*`,
      value: `${type}`,
    });
  return filterOptions;
}

enum filterTypes {
  AVAILABLE = 'AVAILABLE',
  ALL = 'ALL',
}