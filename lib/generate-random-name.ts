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
];
const adjectives = [
  "Happy",
  "Sad",
  "Angry",
  "Excited",
  "Bored",
  "Hungry",
  "Thirsty",
  "Tired",
  "Silly",
  "Scared",
];

export function generateRandomName() {
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  return `${randomAdjective} ${randomNoun}`;
}
