export const title = "Preact HN";
export const description = "A hackernews clone built with preact";
export const color = "#ffa52a";
export const itemsPerPage = 20;

export default {
  lang: "en",
  head: {
    title,
    description,
    meta: [
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
      },
      {
        name: "theme-color",
        content: color
      }
    ],
    customMeta: [
      {
        property: "og:image",
        content: "/og-image.jpg"
      },
      {
        property: "og:image:width",
        content: "280"
      },
      {
        property: "og:image:height",
        content: "280"
      },
      {
        property: "og:title",
        content: title
      },
      {
        property: "og:description",
        content: description
      },
      {
        property: "og:url",
        content: "malbernaz.me"
      }
    ],
    link: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "type/png",
        href: "/favicon-16x16.png",
        sizes: "16x16"
      },
      {
        rel: "icon",
        type: "type/png",
        href: "/favicon-32x32.png",
        sizes: "32x32"
      },
      {
        rel: "manifest",
        href: "/manifest.json"
      },
      {
        rel: "mask-icon",
        href: "/safari-pinned-tab.svg",
        color
      }
    ]
  }
};
