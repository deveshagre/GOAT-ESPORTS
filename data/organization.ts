export type Founder = {
  name: string;
  initials: string;
  title: string;
  email: string;
  bio: string;
  social: readonly { label: string; href: string }[];
};

export const founders: readonly Founder[] = [
  {
    name: "Vedant Shukla",
    initials: "VS",
    title: "Co-Founder",
    email: "vedantyt0777@gmail.com",
    bio: "Co-founder of GOAT Esports. Focused on establishing competitive excellence, talent acquisition, and long-term organization vision across tier-one esports arenas.",
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vedant-shukla-7735a7313/" },
      { label: "Instagram", href: "https://www.instagram.com/ig_java007/" },
      { label: "YouTube", href: "https://youtube.com/@vedant_shukla007" },
      { label: "X", href: "https://x.com/vedantshukla07" },
    ],
  },
  {
    name: "Nitendra Bhadauria",
    initials: "NB",
    title: "Co-Founder",
    email: "adiebhadauria@gmail.com",
    bio: "Co-founder of GOAT Esports. Driving creative identity, high-intensity roster culture, and cross-division competitive operations across mobile and PC platforms.",
    social: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nitendra-singh-940807424?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@adievisuals?si=XitlDQnuy6XWpOtX",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/adieyar?exln=MWZhOHhqY21xc3djbQ==",
      },
      {
        label: "X",
        href: "https://x.com/AdieBhadauria",
      },
    ],
  },
] as const;

export const organizationContact = {
  email: "adiebhadauria@gmail.com",
  secondaryEmail: "vedantyt0777@gmail.com",
  founder: "Vedant Shukla & Nitendra Bhadauria",
  title: "Co-Founders",
  founders,
  social: [
    { label: "LinkedIn (Vedant)", href: "https://www.linkedin.com/in/vedant-shukla-7735a7313/" },
    { label: "Instagram (Vedant)", href: "https://www.instagram.com/ig_java007/" },
    { label: "YouTube (Vedant)", href: "https://youtube.com/@vedant_shukla007" },
    { label: "X (Vedant)", href: "https://x.com/vedantshukla07" },
    {
      label: "LinkedIn (Nitendra)",
      href: "https://www.linkedin.com/in/nitendra-singh-940807424?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
    {
      label: "YouTube (Nitendra)",
      href: "https://youtube.com/@adievisuals?si=XitlDQnuy6XWpOtX",
    },
    {
      label: "Instagram (Nitendra)",
      href: "https://www.instagram.com/adieyar?exln=MWZhOHhqY21xc3djbQ==",
    },
    {
      label: "X (Nitendra)",
      href: "https://x.com/AdieBhadauria",
    },
  ],
} as const;
