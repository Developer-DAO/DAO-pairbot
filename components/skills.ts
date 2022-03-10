import { MessageSelectOptionData } from "discord.js";

//Used as options in a SelectMenu
export function constructSkillsMenu(): MessageSelectOptionData[] {
  const skills = [
    { Web3: ["Solidity", "Solana", "ZK Development"] },
    { Frontend: ["React", "Angular", "Javascript", "Typescript", "UI design"] },
    {
      Backend: [
        "Java",
        "C#",
        "Ruby",
        "Python",
        "Node.js",
        "C++",
        "Rust",
        "Functional programming",
      ],
    },
    { Cloud: ["AWS"] },
    { Database: ["SQL", "PostgreSQL", "IPFS/Arweave..."] },
    { "Web3 related": ["Tokenomics", "DeFi"] },
    { Security: ["Web 3 Security"] },
    { Other: ["Open source", "GraphQL"] },
  ];
  const menuOptions: MessageSelectOptionData[] = [];

  skills.forEach((dict: any) => {
    //Filters through skills
    for (let elem in dict) {
      //Filters through the dictionary
      for (let skill in dict[elem].sort()) {
        //Filters through the values of the dictionary
        menuOptions.push({
          label: dict[elem][skill],
          description: elem,
          value: dict[elem][skill],
        });
      }
    }
  });
  return menuOptions;
}

export function constructExperienceMenu(): MessageSelectOptionData[] {
  const experience = [
    { Beginner: "Newbie" },
    {
      "Pre-Intermediate":
        "Level with the big Aaghhh, coming out of the hand-holding stage",
    },
    { Intermediate: "Nice and comfortable with what you know" },
    { Advanced: "Ninja turtle" },
  ];
  const menuOptions: MessageSelectOptionData[] = [];

  experience.forEach((dict: any) => {
    //Filters through skills
    for (let elem in dict) {
      //Filters through the dictionary
      menuOptions.push({
        label: elem,
        description: dict[elem],
        value: elem,
      });
    }
  });
  return menuOptions;
}
