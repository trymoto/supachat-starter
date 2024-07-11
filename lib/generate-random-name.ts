const adjectives = [
  "Happy",
  "Excited",
  "Bored",
  "Hungry",
  "Thirsty",
  "Tired",
  "Silly",
  "Thoughtful",
  "Sleepy",
  "Confused",
  "Curious",
  "Sneaky",
  "Clever",
];
const nouns = [
  "Dog",
  "Cat",
  "Bird",
  "Fish",
  "Rabbit",
  "Turtle",
  "Hamster",
  "Gerbil",
  "Guinea Pig",
  "Chinchilla",
  "Frog",
  "Lizard",
  "Snake",
  "Parrot",
  "Mouse",
];

export function generateRandomName() {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}
