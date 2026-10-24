export const efSetLevelTest = {
  title: "EF SET Style English Assessment",
  passage: "Please read the questions carefully and select the most appropriate answer to complete the sentence or respond to the prompt. This test adapts to your proficiency level, so do your best!",
  questions: [
    // ── A1 Level (Beginner) ──
    {
      question: "Hello! What _____ your name?",
      options: ["is", "are", "am", "be"],
      correct_answer: "is",
      explanation: "'is' is the correct present tense form of the verb 'to be' for third-person singular (your name)."
    },
    {
      question: "I _____ from Canada.",
      options: ["am", "is", "are", "do"],
      correct_answer: "am",
      explanation: "'am' is the correct form of the verb 'to be' for first-person singular (I)."
    },
    {
      question: "She _____ like apples.",
      options: ["doesn't", "don't", "isn't", "aren't"],
      correct_answer: "doesn't",
      explanation: "'doesn't' (does not) is used for third-person singular present simple negative sentences."
    },
    {
      question: "My brother _____ a new car.",
      options: ["has", "have", "having", "is"],
      correct_answer: "has",
      explanation: "'has' is the third-person singular form of the verb 'have'."
    },
    {
      question: "Do you _____ coffee?",
      options: ["drink", "drinks", "drinking", "drank"],
      correct_answer: "drink",
      explanation: "In present simple questions with 'do', we use the base form of the verb."
    },
    {
      question: "They _____ to the park on Sundays.",
      options: ["go", "goes", "going", "are go"],
      correct_answer: "go",
      explanation: "For 'they', the present simple form of the verb does not take an 's'."
    },

    // ── A2 Level (Elementary) ──
    {
      question: "I went to the store _____ buy some milk.",
      options: ["to", "for", "in", "at"],
      correct_answer: "to",
      explanation: "We use 'to' + infinitive to express purpose."
    },
    {
      question: "How _____ money do you have?",
      options: ["much", "many", "a lot", "lots"],
      correct_answer: "much",
      explanation: "'money' is an uncountable noun, so we use 'how much'."
    },
    {
      question: "They _____ dinner when I arrived.",
      options: ["were eating", "eating", "eat", "was eating"],
      correct_answer: "were eating",
      explanation: "Past continuous (were eating) is used for an action in progress when another action happened."
    },
    {
      question: "Have you ever _____ to Paris?",
      options: ["been", "went", "go", "going"],
      correct_answer: "been",
      explanation: "Present perfect tense uses 'have/has' + past participle. The past participle of go (for visits) is 'been'."
    },
    {
      question: "My house is _____ than yours.",
      options: ["bigger", "more big", "biggest", "big"],
      correct_answer: "bigger",
      explanation: "For short adjectives like 'big', we add '-er' to form the comparative."
    },
    {
      question: "I didn't _____ him yesterday.",
      options: ["see", "saw", "seen", "seeing"],
      correct_answer: "see",
      explanation: "After 'did not' (didn't), we always use the base form of the verb."
    },

    // ── B1 Level (Intermediate) ──
    {
      question: "If it rains tomorrow, we _____ at home.",
      options: ["will stay", "stay", "would stay", "stayed"],
      correct_answer: "will stay",
      explanation: "First conditional: If + present simple, will + base verb."
    },
    {
      question: "You _____ to wear a uniform at this school.",
      options: ["have", "must", "should", "needn't"],
      correct_answer: "have",
      explanation: "'Have to' expresses external obligation."
    },
    {
      question: "I'm looking forward _____ you next week.",
      options: ["to seeing", "to see", "seeing", "see"],
      correct_answer: "to seeing",
      explanation: "The phrase 'look forward to' is followed by a gerund (-ing form)."
    },
    {
      question: "The book, _____ was written in 1920, is a classic.",
      options: ["which", "who", "that", "where"],
      correct_answer: "which",
      explanation: "Non-defining relative clauses use 'which' for things, not 'that'."
    },
    {
      question: "She asked me where _____.",
      options: ["I lived", "do I live", "did I live", "I live"],
      correct_answer: "I lived",
      explanation: "In reported questions, word order changes to subject + verb, and tenses usually shift back."
    },
    {
      question: "I have been learning English _____ three years.",
      options: ["for", "since", "during", "in"],
      correct_answer: "for",
      explanation: "We use 'for' to indicate a period or duration of time."
    },

    // ── B2 Level (Upper Intermediate) ──
    {
      question: "By this time next year, I _____ my degree.",
      options: ["will have finished", "will finish", "am finishing", "have finished"],
      correct_answer: "will have finished",
      explanation: "Future perfect is used for an action that will be completed before a specific time in the future."
    },
    {
      question: "I wish I _____ more time to study.",
      options: ["had", "have", "will have", "would have"],
      correct_answer: "had",
      explanation: "We use 'wish' + past tense to express a present regret or desire."
    },
    {
      question: "He is believed _____ the country.",
      options: ["to have left", "to leave", "leaving", "that he left"],
      correct_answer: "to have left",
      explanation: "Passive reporting verbs are often followed by the perfect infinitive (to have + past participle) for past actions."
    },
    {
      question: "Rarely _____ such a beautiful sunset.",
      options: ["have I seen", "I have seen", "did I see", "I saw"],
      correct_answer: "have I seen",
      explanation: "Negative adverbs (like rarely) at the beginning of a sentence require subject-verb inversion."
    },
    {
      question: "The new bridge _____ by the mayor tomorrow.",
      options: ["is being opened", "will open", "is opening", "opens"],
      correct_answer: "is being opened",
      explanation: "Present continuous passive is often used for fixed future arrangements."
    },
    {
      question: "We'd better hurry up, _____ we?",
      options: ["hadn't", "wouldn't", "shouldn't", "didn't"],
      correct_answer: "hadn't",
      explanation: "'We'd better' stands for 'we had better', so the correct question tag uses 'had'."
    },

    // ── C1 Level (Advanced) ──
    {
      question: "Had I known about the traffic, I _____ earlier.",
      options: ["would have left", "would leave", "will have left", "had left"],
      correct_answer: "would have left",
      explanation: "Third conditional with inversion: 'Had I known' means 'If I had known', followed by 'would have' + past participle."
    },
    {
      question: "He didn't mean to break the vase; it was purely _____.",
      options: ["accidental", "deliberate", "spontaneous", "intuitive"],
      correct_answer: "accidental",
      explanation: "Vocabulary: 'Accidental' means happening by chance or unintentionally."
    },
    {
      question: "The new policy will be implemented _____ of the consequences.",
      options: ["regardless", "despite", "although", "furthermore"],
      correct_answer: "regardless",
      explanation: "'Regardless of' means without being affected by the mentioned situation."
    },
    {
      question: "Only when she opened the letter _____ what had happened.",
      options: ["did she realize", "she realized", "she had realized", "realized she"],
      correct_answer: "did she realize",
      explanation: "Inversion is required after 'Only when' at the beginning of a sentence."
    },
    {
      question: "I'd rather you _____ smoke in the house.",
      options: ["didn't", "don't", "wouldn't", "won't"],
      correct_answer: "didn't",
      explanation: "'Would rather' followed by a subject requires the past tense to express a preference about someone else's action."
    },
    {
      question: "The company is on the _____ of collapse.",
      options: ["verge", "edge", "border", "brink"],
      correct_answer: "verge",
      explanation: "The idiom is 'on the verge of' (or brink of) meaning very close to experiencing something."
    },

    // ── C2 Level (Proficient) ──
    {
      question: "The politician's speech was so _____ that the audience was utterly confused.",
      options: ["convoluted", "lucid", "succinct", "compelling"],
      correct_answer: "convoluted",
      explanation: "Vocabulary: 'Convoluted' means extremely complex and difficult to follow."
    },
    {
      question: "It is imperative that she _____ present at the meeting.",
      options: ["be", "is", "was", "will be"],
      correct_answer: "be",
      explanation: "The subjunctive mood uses the base form of the verb ('be') after 'It is imperative that'."
    },
    {
      question: "He was completely _____ by her sudden change of heart.",
      options: ["flummoxed", "enamored", "vindicated", "placated"],
      correct_answer: "flummoxed",
      explanation: "Vocabulary: 'Flummoxed' means completely bewildered or confused."
    },
    {
      question: "There's no point _____ over spilt milk.",
      options: ["crying", "to cry", "cry", "in crying"],
      correct_answer: "crying",
      explanation: "The phrase 'there's no point' is followed by a gerund (-ing form)."
    },
    {
      question: "No sooner had they left the building _____ the bomb exploded.",
      options: ["than", "when", "that", "then"],
      correct_answer: "than",
      explanation: "'No sooner' is always paired with 'than' in past perfect inversions."
    },
    {
      question: "She has a _____ for learning languages quickly.",
      options: ["knack", "habit", "trend", "norm"],
      correct_answer: "knack",
      explanation: "Vocabulary: 'A knack for' means a natural skill or ability to do something well."
    }
  ]
};
