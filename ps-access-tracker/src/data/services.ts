import type { PublicService } from "../types";

export const services: PublicService[] = [
  {
    id: "passport",
    name: "Passport Application",
    category: "Immigration",
    description: "Apply for a new passport or renewal. Required for international travel.",
    requirements: [
      "National ID",
      "Passport photos (2 recent photos)",
      "Completed application form",
      "Birth certificate or citizenship proof",
    ],
    stages: [
      { name: "Submission", office: "District Office", time: "1 day" },
      { name: "Verification", office: "Immigration HQ", time: "3 days" },
      { name: "Processing", office: "Immigration HQ", time: "5 days" },
      { name: "Approval", office: "Immigration Director", time: "2 days" },
      { name: "Collection", office: "District Office", time: "1 day" },
    ],
  },
  {
    id: "driving-license",
    name: "Driving License",
    category: "Transport",
    description: "Obtain a new driving license or renew an existing one.",
    requirements: [
      "National ID",
      "Medical certificate",
      "Passport photos",
      "Completed application form",
      "Proof of residence",
    ],
    stages: [
      { name: "Document Submission", office: "District Transport Office", time: "1 day" },
      { name: "Verification", office: "Central Transport Authority", time: "2 days" },
      { name: "Processing", office: "License Division", time: "5 days" },
      { name: "Approval", office: "Director of Transport", time: "2 days" },
      { name: "Collection", office: "District Transport Office", time: "1 day" },
    ],
  },
  {
    id: "birth-certificate",
    name: "Birth Certificate",
    category: "Civil Registration",
    description: "Request an official birth certificate from civil registration.",
    requirements: [
      "National ID or parent's ID",
      "Hospital birth record (if available)",
      "Application form",
      "Proof of identity",
    ],
    stages: [
      { name: "Submission", office: "District Registry", time: "1 day" },
      { name: "Verification", office: "Central Civil Registry", time: "3 days" },
      { name: "Processing", office: "Registry Office", time: "4 days" },
      { name: "Approval", office: "Registry Director", time: "1 day" },
      { name: "Collection", office: "District Registry", time: "1 day" },
    ],
  },
  {
    id: "national-id",
    name: "National ID",
    category: "Identity",
    description: "Apply for or replace a national identification card.",
    requirements: [
      "Birth certificate",
      "Proof of residence",
      "Recent passport photos",
      "Completed application form",
    ],
    stages: [
      { name: "Submission", office: "District Office", time: "1 day" },
      { name: "Verification", office: "Central Authority", time: "4 days" },
      { name: "Processing", office: "ID Production Unit", time: "7 days" },
      { name: "Approval", office: "Director General", time: "2 days" },
      { name: "Collection", office: "District Office", time: "1 day" },
    ],
  },
];
