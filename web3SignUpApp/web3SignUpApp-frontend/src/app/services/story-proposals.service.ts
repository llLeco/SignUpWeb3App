import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoryProposalsService {
  storyProposals = [
    {
      id: 1,
      image: "assets/anime.jpeg",
      title: "The Time Traveler",
      briefSummary: "A thrilling story about a scientist who invents a time machine and travels to the future.",
      startDate: "May 10, 2023",
      category: ["Science Fiction"],
      tags: ["Mecha", "Historical", "Tragedy"],
      language: "English",
      status: "In Progress",
      currentProgress: "S1:EP4 ( 20% )",
      contributors: 10,
      votes: 120,
      author: "Author1",
      needs: [
        { role: "Contributors", value: true },
        { role: "Editor", value: false },
        { role: "Illustrator", value: true },
        { role: "Translator", value: false },
      ],
      "threads": [
        {
          "id": 1,
          "type": "idea",
          "title": "New plot twist idea",
          "author": "User1",
          "content": "What if the time machine breaks and the scientist is stuck in the future?",
          "category": "Ideas",
          "likes": 10,
          "comments": 3,
          "date": "May 30"
        },
        {
          "id": 2,
          "type": "art",
          "title": "Character design sketches",
          "author": "User2",
          "content": "I've done some sketches of the scientist, what do you think?",
          "category": "Art",
          "likes": 10,
          "comments": 3,
          "date": "May 30"
        },
        {
          "id": 3,
          "type": "translation",
          "title": "Translation to Spanish",
          "author": "User3",
          "content": "I've started translating the story to Spanish, any help is welcomed!",
          "category": "Translation",
          "likes": 10,
          "comments": 3,
          "date": "May 30"
        }
      ]
    },
    {
      id: 2,
      image: "assets/anime.jpeg",
      title: "The Lost Kingdom",
      briefSummary: "An adventurous tale of a group of explorers who discover an ancient kingdom hidden deep in the jungle.",
      startDate: "June 1, 2023",
      category: ["Adventure"],
      tags: ["Jungle", "Mystery", "Exploration"],
      language: "English",
      status: "In Progress",
      currentProgress: "S1:EP2 ( 10% )",
      contributors: 12,
      votes: 200,
      author: "Author2",
      needs: [
        { role: "Contributors", value: false },
        { role: "Editor", value: true },
        { role: "Illustrator", value: true },
        { role: "Translator", value: false },
      ],
      "threads": [
        {
          "id": 1,
          "type": "idea",
          "title": "Exploring the Lost Kingdom",
          "content": "I think our group should delve deeper into the ancient kingdom. There could be hidden chambers and secrets we've yet to discover.",
          "author": "User123",
          "date": "May 30",
          "likes": 40,
          "comments": 15
        },
        {
          "id": 2,
          "type": "idea",
          "title": "The True History of the Kingdom",
          "content": "I believe the kingdom's history isn't as we know it. We should look for more clues in the kingdom's architecture and artifacts.",
          "author": "User456",
          "date": "May 30",
          "likes": 50,
          "comments": 10
        },
        {
          "id": 3,
          "type": "art",
          "title": "Kingdom Concept Art",
          "content": "I've made a concept art of how I envision the Lost Kingdom. Let me know what you think!",
          "author": "User789",
          "date": "May 30",
          "likes": 60,
          "comments": 20
        },
        {
          "id": 4,
          "type": "translation",
          "title": "Translation to Spanish",
          "content": "I've started translating the story to Spanish. Any help is appreciated!",
          "author": "User101",
          "date": "May 30",
          "likes": 70,
          "comments": 30
        }

      ]
    },
    {
      id: 3,
      image: "assets/anime.jpeg",
      title: "The Final Battle",
      briefSummary: "A captivating story about a group of warriors who band together to fight a powerful enemy threatening their homeland.",
      startDate: "Jan 8, 2023",
      category: ["Fantasy"],
      tags: ["War", "Heroes", "Epic"],
      language: "English",
      status: "In Progress",
      currentProgress: "S1:EP6 ( 30% )",
      contributors: 6,
      votes: 300,
      author: "Author3",
      needs: [
        { role: "Contributors", value: true },
        { role: "Editor", value: true },
        { role: "Illustrator", value: false },
        { role: "Translator", value: true },
      ],
      "threads": [
        {
          "id": 1,
          "type": "idea",
          "title": "Preparing for the Final Battle",
          "content": "Our warriors need to train and gather resources for the final battle. They could meet mentors who help them learn new skills and tactics.",
          "author": "User123",
          "date": "May 30",
          "likes": 45,
          "comments": 25
        },
        {
          "id": 2,
          "type": "idea",
          "title": "Alliances and Betrayals",
          "content": "What if there are factions within our warriors' group? There could be alliances and betrayals, which would add more drama and intrigue.",
          "author": "User456",
          "date": "May 30",
          "likes": 55,
          "comments": 15
        },
        {
          "id": 3,
          "type": "art",
          "title": "Character Concept Art",
          "content": "I've created some concept art for one of our warriors. I'd love to hear your feedback!",
          "author": "User789",
          "date": "May 30",
          "likes": 65,
          "comments": 35
        },
        {
          "id": 4,
          "type": "translation",
          "title": "Translation to French",
          "content": "I'm working on a French translation of our story. Anyone who wants to contribute is more than welcome!",
          "author": "User101",
          "date": "May 30",
          "likes": 75,
          "comments": 45
        }
      ]
    }
  ];

  constructor() { }

  getProposals() {
    return this.storyProposals;
  }

  getProposal(id: number) {
    return this.storyProposals.find(proposal => proposal.id === id);
  }
}
