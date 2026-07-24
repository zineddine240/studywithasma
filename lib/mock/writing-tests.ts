export type TaskType = "Academic Task 1" | "General Task 1" | "Task 2";

export type WritingTestStatus = "Not Started" | "Draft" | "Submitted" | "Completed";

export interface WritingDraft {
  testId: string;
  text: string;
  lastUpdated: number;
}

export type VisualDataType = "line-graph" | "bar-chart" | "table" | "pie-charts" | "process-diagram";

export interface VisualData {
  type: VisualDataType;
  data: any;
}

export interface WritingTest {
  id: string;
  taskType: TaskType;
  title: string;
  topicSummary: string;
  prompt: string;
  recommendedTime: number; // in minutes
  minWords: number;
  visualData?: VisualData; // For Academic Task 1
  essayType?: string; // For Task 2
  tone?: string; // For General Task 1
}

export const writingTests: WritingTest[] = [
  // ==================================================
  // ACADEMIC TASK 1
  // ==================================================
  {
    id: "ac-t1-1",
    taskType: "Academic Task 1",
    title: "Online Course Enrolment",
    topicSummary: "Line graph: Students enrolled in online courses (Algeria, France, Canada).",
    prompt: "The line graph shows the number of students enrolled in online courses in Algeria, France, and Canada between 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    recommendedTime: 20,
    minWords: 150,
    visualData: {
      type: "line-graph",
      data: {
        title: "Online Course Enrolment (2015 - 2025)",
        yAxis: "Number of Students",
        xAxis: "Year",
        labels: ["2015", "2017", "2019", "2021", "2023", "2025"],
        datasets: [
          { label: "Algeria", color: "#8b5cf6", data: [20000, 30000, 45000, 70000, 95000, 125000] },
          { label: "France", color: "#3b82f6", data: [45000, 52000, 60000, 75000, 88000, 105000] },
          { label: "Canada", color: "#10b981", data: [35000, 43000, 58000, 78000, 100000, 130000] }
        ]
      }
    }
  },
  {
    id: "ac-t1-2",
    taskType: "Academic Task 1",
    title: "Smartphone Ownership by Age",
    topicSummary: "Bar chart: Percentage of people owning smartphones by age (2015 vs 2025).",
    prompt: "The bar chart shows the percentage of people who owned a smartphone in five age groups in 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    recommendedTime: 20,
    minWords: 150,
    visualData: {
      type: "bar-chart",
      data: {
        title: "Smartphone Ownership by Age Group",
        yAxis: "Percentage (%)",
        xAxis: "Age Group",
        labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
        datasets: [
          { label: "2015", color: "#94a3b8", data: [82, 75, 63, 46, 25] },
          { label: "2025", color: "#8b5cf6", data: [98, 95, 89, 78, 61] }
        ]
      }
    }
  },
  {
    id: "ac-t1-3",
    taskType: "Academic Task 1",
    title: "Underground Railway Systems",
    topicSummary: "Table: Underground railway systems in six cities.",
    prompt: "The table provides information about underground railway systems in six cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    recommendedTime: 20,
    minWords: 150,
    visualData: {
      type: "table",
      data: {
        title: "Underground Railway Systems in Six Cities",
        headers: ["City", "Opened", "Route Length (km)", "Annual Passengers (millions)"],
        rows: [
          ["London", "1863", "402", "1,350"],
          ["Paris", "1900", "227", "1,500"],
          ["Tokyo", "1927", "304", "3,100"],
          ["Mexico City", "1969", "226", "1,650"],
          ["Beijing", "1969", "783", "3,950"],
          ["New York", "1904", "399", "1,700"]
        ]
      }
    }
  },
  {
    id: "ac-t1-4",
    taskType: "Academic Task 1",
    title: "Household Spending",
    topicSummary: "Pie charts: Average household spending in 2000 and 2025.",
    prompt: "The two pie charts compare average household spending in a country in 2000 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    recommendedTime: 20,
    minWords: 150,
    visualData: {
      type: "pie-charts",
      data: {
        title: "Household Spending Comparison (2000 vs 2025)",
        charts: [
          {
            label: "2000",
            segments: [
              { name: "Housing", value: 30, color: "#8b5cf6" },
              { name: "Food", value: 25, color: "#3b82f6" },
              { name: "Transport", value: 15, color: "#10b981" },
              { name: "Education", value: 10, color: "#f59e0b" },
              { name: "Entertainment", value: 8, color: "#ef4444" },
              { name: "Other", value: 12, color: "#64748b" }
            ]
          },
          {
            label: "2025",
            segments: [
              { name: "Housing", value: 35, color: "#8b5cf6" },
              { name: "Food", value: 18, color: "#3b82f6" },
              { name: "Transport", value: 17, color: "#10b981" },
              { name: "Education", value: 13, color: "#f59e0b" },
              { name: "Entertainment", value: 10, color: "#ef4444" },
              { name: "Other", value: 7, color: "#64748b" }
            ]
          }
        ]
      }
    }
  },
  {
    id: "ac-t1-5",
    taskType: "Academic Task 1",
    title: "Glass Recycling Process",
    topicSummary: "Process diagram: Recycling glass bottles.",
    prompt: "The diagram shows the process used to recycle glass bottles.\n\nSummarise the information by selecting and reporting the main features.",
    recommendedTime: 20,
    minWords: 150,
    visualData: {
      type: "process-diagram",
      data: {
        title: "Glass Recycling Process",
        steps: [
          { id: 1, text: "Used glass bottles are collected." },
          { id: 2, text: "Bottles are transported to a recycling facility." },
          { id: 3, text: "Glass is sorted by colour." },
          { id: 4, text: "Bottles are washed and cleaned." },
          { id: 5, text: "Glass is crushed into small pieces." },
          { id: 6, text: "The crushed glass is heated and melted." },
          { id: 7, text: "New bottles are shaped." },
          { id: 8, text: "The finished bottles are delivered to shops." }
        ]
      }
    }
  },

  // ==================================================
  // GENERAL TASK 1
  // ==================================================
  {
    id: "gn-t1-1",
    taskType: "General Task 1",
    title: "Problem with Apartment Heating",
    topicSummary: "Formal letter to landlord about broken heating.",
    prompt: "You recently moved into a rented apartment, but the heating system is not working properly.\n\nWrite a letter to your landlord. In your letter:\n- Explain the problem.\n- Describe how it is affecting you.\n- Say what action you would like the landlord to take.",
    recommendedTime: 20,
    minWords: 150,
    tone: "Formal"
  },
  {
    id: "gn-t1-2",
    taskType: "General Task 1",
    title: "Requesting a Work Schedule Change",
    topicSummary: "Formal letter to manager requesting schedule change.",
    prompt: "You need to change your working hours for the next month.\n\nWrite a letter to your manager. In your letter:\n- Explain why you need the change.\n- Suggest a new working schedule.\n- Explain how you will ensure that your work is completed.",
    recommendedTime: 20,
    minWords: 150,
    tone: "Formal"
  },
  {
    id: "gn-t1-3",
    taskType: "General Task 1",
    title: "Inviting a Friend to Visit",
    topicSummary: "Informal letter inviting a friend to a new city.",
    prompt: "You have recently moved to a new city and would like a friend to visit you.\n\nWrite a letter to your friend. In your letter:\n- Describe your new home.\n- Explain what you can do together.\n- Suggest suitable dates for the visit.",
    recommendedTime: 20,
    minWords: 150,
    tone: "Informal"
  },
  {
    id: "gn-t1-4",
    taskType: "General Task 1",
    title: "Lost Luggage Complaint",
    topicSummary: "Formal letter to airline about missing luggage.",
    prompt: "Your luggage did not arrive after a recent flight.\n\nWrite a letter to the airline. In your letter:\n- Provide details about your flight.\n- Describe your missing luggage.\n- Explain what you want the airline to do.",
    recommendedTime: 20,
    minWords: 150,
    tone: "Formal"
  },
  {
    id: "gn-t1-5",
    taskType: "General Task 1",
    title: "Thanking a Course Instructor",
    topicSummary: "Semi-formal letter of thanks to a training instructor.",
    prompt: "You recently completed a training course that was especially useful.\n\nWrite a letter to the instructor. In your letter:\n- Thank the instructor.\n- Explain what you found useful.\n- Describe how the course will help you in the future.",
    recommendedTime: 20,
    minWords: 150,
    tone: "Semi-formal"
  },

  // ==================================================
  // TASK 2
  // ==================================================
  {
    id: "t2-1",
    taskType: "Task 2",
    title: "Technology and Human Relationships",
    topicSummary: "Discuss both views: Technology strengthens vs isolates relationships.",
    prompt: "Some people believe that technology has made relationships stronger, while others think it has made people more isolated.\n\nDiscuss both views and give your own opinion.",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Discuss Both Views"
  },
  {
    id: "t2-2",
    taskType: "Task 2",
    title: "Public Transport or New Roads",
    topicSummary: "Discuss both views: Invest in public transport vs new roads.",
    prompt: "Some people believe governments should invest more money in public transport, while others think building new roads is more important.\n\nDiscuss both views and give your own opinion.",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Discuss Both Views"
  },
  {
    id: "t2-3",
    taskType: "Task 2",
    title: "Homework and Children’s Free Time",
    topicSummary: "Discuss both views: Daily homework vs more free time.",
    prompt: "Some people believe schoolchildren should receive homework every day. Others believe children need more free time after school.\n\nDiscuss both views and give your own opinion.",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Discuss Both Views"
  },
  {
    id: "t2-4",
    taskType: "Task 2",
    title: "Working from Home",
    topicSummary: "Advantages vs Disadvantages: Employees working from home.",
    prompt: "An increasing number of employees now work from home rather than travelling to an office.\n\nDo the advantages of working from home outweigh the disadvantages?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Advantages and Disadvantages"
  },
  {
    id: "t2-5",
    taskType: "Task 2",
    title: "Foreign Languages in Primary School",
    topicSummary: "Advantages vs Disadvantages: Learning languages early.",
    prompt: "Some experts believe children should begin learning a foreign language at primary school rather than secondary school.\n\nDo the advantages of this development outweigh the disadvantages?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Advantages and Disadvantages"
  },
  {
    id: "t2-6",
    taskType: "Task 2",
    title: "University Subject Choice",
    topicSummary: "Discuss both views: Study useful subjects vs any subject.",
    prompt: "Some people believe university students should study only subjects that will be useful for their future careers. Others believe students should be free to study any subject they choose.\n\nDiscuss both views and give your own opinion.",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Discuss Both Views"
  },
  {
    id: "t2-7",
    taskType: "Task 2",
    title: "Traffic Congestion in Cities",
    topicSummary: "Problem and Solution: City traffic congestion.",
    prompt: "Traffic congestion has become a serious problem in many large cities.\n\nWhat are the main causes of this problem, and what measures can governments take to solve it?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Problem and Solution"
  },
  {
    id: "t2-8",
    taskType: "Task 2",
    title: "Artificial Intelligence in Education",
    topicSummary: "Positive/Negative: AI in education.",
    prompt: "Artificial intelligence is increasingly being used to help students learn and complete academic work.\n\nIs this a positive or negative development?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Positive or Negative Development"
  },
  {
    id: "t2-9",
    taskType: "Task 2",
    title: "Practical Skills at School",
    topicSummary: "Agree/Disagree: Teaching practical skills at school.",
    prompt: "Schools should give greater importance to practical skills such as cooking, financial management, and basic home maintenance.\n\nTo what extent do you agree or disagree?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Opinion Essay"
  },
  {
    id: "t2-10",
    taskType: "Task 2",
    title: "Online Education",
    topicSummary: "Two-Part Question: Reasons for online study & is it positive?",
    prompt: "More students are choosing to study online instead of attending classes on campus.\n\nWhat are the reasons for this development? Is it a positive or negative trend?",
    recommendedTime: 40,
    minWords: 250,
    essayType: "Two-Part Question"
  }
];
