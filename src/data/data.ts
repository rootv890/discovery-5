// TODO Fetch From Database in the future
export const heroIllustrations: { url: string, identifier: string; }[] = [
  {
    url: "web@2x.png",
    identifier: "Web illustration",
  },
  {
    url: "pcs@2x.png",
    identifier: "Mac and Windows illustration",
  },
  {
    url: "books@2x.png",
    identifier: "books illustration",
  },
  {
    url: "extension@2x.png",
    identifier: "extension & plugins illustration",
  },
];


export const marketingNavItems: {
  title: string,
  url: string;

}[] = [
    {
      title: "tools",
      url: "/",
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Join",
      url: "/join",
    },
    {
      title: "Contact",
      url: "/contact",
    }
  ];


type IllustrationType = Record<string, {
  url: string;
  alt: string;
}>;


export const svgIllustrations: Record<string, IllustrationType> = {
  waitlistIllustrations: {
    webUI: {
      url: "floating-ui.svg",
      alt: "Requesting Hand illustration",
    },
    request: {
      url: "requesting-hand.svg",
      alt: "Web UI floating illustration",
    }
  },
  thankYouIllustrations: {
    thankYou: {
      url: "thank-you.svg",
      alt: "Thank you illustration",
    }
  },

};
