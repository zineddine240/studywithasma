export interface ProcessStep {
  step: string;
  title: string;
  line1: string;
  line2: string;
  mobileDesc: string;
  isTopCard: boolean;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Search",
    line1: "Search 20K courses",
    line2: "from 50K University",
    mobileDesc:
      "Search 20K courses from 50K University across France and Italy.",
    isTopCard: true,
  },
  {
    step: "02",
    title: "Compare",
    line1: "Compare your options",
    line2: "all in one place",
    mobileDesc: "Compare your options all in one place.",
    isTopCard: false,
  },
  {
    step: "03",
    title: "Engage",
    line1: "Connect with our experts",
    line2: "to get a consultation",
    mobileDesc: "Connect with our experts to get a consultation.",
    isTopCard: true,
  },
  {
    step: "04",
    title: "Apply",
    line1: "Our experts will assist to",
    line2: "get student visa",
    mobileDesc: "Our experts will assist to get student visa.",
    isTopCard: false,
  },
  {
    step: "05",
    title: "Go Abroad",
    line1: "At last, Kick off your",
    line2: "fresh study journey",
    mobileDesc: "At last, Kick off your fresh study journey.",
    isTopCard: true,
  },
];
