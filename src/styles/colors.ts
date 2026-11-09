/**
 * Color primitives from the SuperConscious design system (Figma page "Colors").
 * LM = light mode, DM = dark mode. Each `token` is a CSS custom property defined in colors.css.
 */
export interface ColorToken {
  name: string;
  token: string;
  value: string;
  label: string;
}

export interface ColorGroup {
  section: 'Neutrals' | 'Periwinkles' | 'Status';
  group: string;
  colors: ColorToken[];
}

export const colorGroups: ColorGroup[] = [
  {
    "section": "Neutrals",
    "group": "Whites",
    "colors": [
      {
        "name": "Pure White",
        "token": "--is-color-pure-white",
        "value": "#ffffff",
        "label": "#FFFFFF"
      },
      {
        "name": "Off-White",
        "token": "--is-color-off-white",
        "value": "#f0f2f4",
        "label": "#F0F2F4"
      }
    ]
  },
  {
    "section": "Neutrals",
    "group": "Translucent Whites",
    "colors": [
      {
        "name": "TWhite 4",
        "token": "--is-color-twhite-4",
        "value": "rgba(255, 255, 255, 0.04)",
        "label": "#FFFFFF @ 4%"
      },
      {
        "name": "TWhite 8",
        "token": "--is-color-twhite-8",
        "value": "rgba(255, 255, 255, 0.08)",
        "label": "#FFFFFF @ 8%"
      },
      {
        "name": "TWhite 10",
        "token": "--is-color-twhite-10",
        "value": "rgba(255, 255, 255, 0.1)",
        "label": "#FFFFFF @ 10%"
      },
      {
        "name": "TWhite 18",
        "token": "--is-color-twhite-18",
        "value": "rgba(255, 255, 255, 0.18)",
        "label": "#FFFFFF @ 18%"
      },
      {
        "name": "TWhite 36",
        "token": "--is-color-twhite-36",
        "value": "rgba(255, 255, 255, 0.36)",
        "label": "#FFFFFF @ 36%"
      },
      {
        "name": "TWhite 50",
        "token": "--is-color-twhite-50",
        "value": "rgba(255, 255, 255, 0.5)",
        "label": "#FFFFFF @ 50%"
      }
    ]
  },
  {
    "section": "Neutrals",
    "group": "Blacks",
    "colors": [
      {
        "name": "Pure Black",
        "token": "--is-color-pure-black",
        "value": "#000000",
        "label": "#000000"
      },
      {
        "name": "Black 1",
        "token": "--is-color-black-1",
        "value": "#17191c",
        "label": "#17191C"
      },
      {
        "name": "Black 2",
        "token": "--is-color-black-2",
        "value": "#0a0c0f",
        "label": "#0A0C0F"
      }
    ]
  },
  {
    "section": "Neutrals",
    "group": "Translucent Blacks",
    "colors": [
      {
        "name": "TBlack 60",
        "token": "--is-color-tblack-60",
        "value": "rgba(0, 0, 0, 0.6)",
        "label": "#000000 @ 60%"
      },
      {
        "name": "TBlack 80",
        "token": "--is-color-tblack-80",
        "value": "rgba(0, 0, 0, 0.8)",
        "label": "#000000 @ 80%"
      }
    ]
  },
  {
    "section": "Neutrals",
    "group": "Greys",
    "colors": [
      {
        "name": "Grey 1",
        "token": "--is-color-grey-1",
        "value": "#99a3ad",
        "label": "#99A3AD"
      },
      {
        "name": "Grey 2",
        "token": "--is-color-grey-2",
        "value": "#6b747d",
        "label": "#6B747D"
      },
      {
        "name": "Grey 3",
        "token": "--is-color-grey-3",
        "value": "#434a51",
        "label": "#434A51"
      },
      {
        "name": "Grey 4",
        "token": "--is-color-grey-4",
        "value": "#1d1c1e",
        "label": "#1D1C1E"
      }
    ]
  },
  {
    "section": "Neutrals",
    "group": "Translucent Greys",
    "colors": [
      {
        "name": "TGrey 3",
        "token": "--is-color-tgrey-3",
        "value": "rgba(29, 28, 30, 0.03)",
        "label": "#1D1C1E @ 3%"
      },
      {
        "name": "TGrey 6",
        "token": "--is-color-tgrey-6",
        "value": "rgba(29, 28, 30, 0.06)",
        "label": "#1D1C1E @ 6%"
      },
      {
        "name": "TGrey 12",
        "token": "--is-color-tgrey-12",
        "value": "rgba(29, 28, 30, 0.12)",
        "label": "#1D1C1E @ 12%"
      },
      {
        "name": "TGrey 22",
        "token": "--is-color-tgrey-22",
        "value": "rgba(29, 28, 30, 0.22)",
        "label": "#1D1C1E @ 22%"
      },
      {
        "name": "TGrey 44",
        "token": "--is-color-tgrey-44",
        "value": "rgba(29, 28, 30, 0.44)",
        "label": "#1D1C1E @ 44%"
      }
    ]
  },
  {
    "section": "Periwinkles",
    "group": "Periwinkles",
    "colors": [
      {
        "name": "Periwinkle Main LM",
        "token": "--is-color-periwinkle-main-lm",
        "value": "#3966ff",
        "label": "#3966FF"
      },
      {
        "name": "Periwinkle Main DM",
        "token": "--is-color-periwinkle-main-dm",
        "value": "#5479ff",
        "label": "#5479FF"
      },
      {
        "name": "Periwinkle 1",
        "token": "--is-color-periwinkle-1",
        "value": "#d6dbfe",
        "label": "#D6DBFE"
      },
      {
        "name": "Periwinkle 2",
        "token": "--is-color-periwinkle-2",
        "value": "#b3bbfb",
        "label": "#B3BBFB"
      },
      {
        "name": "Periwinkle 3",
        "token": "--is-color-periwinkle-3",
        "value": "#8b93f6",
        "label": "#8B93F6"
      },
      {
        "name": "Periwinkle 4",
        "token": "--is-color-periwinkle-4",
        "value": "#6c78ef",
        "label": "#6C78EF"
      }
    ]
  },
  {
    "section": "Periwinkles",
    "group": "Translucent Periwinkles",
    "colors": [
      {
        "name": "T Periwinkle 20",
        "token": "--is-color-tperiwinkle-20",
        "value": "rgba(57, 102, 255, 0.2)",
        "label": "#3966FF @ 20%"
      }
    ]
  },
  {
    "section": "Status",
    "group": "Reds",
    "colors": [
      {
        "name": "Light Red LM",
        "token": "--is-color-light-red-lm",
        "value": "#fdc1cc",
        "label": "#FDC1CC"
      },
      {
        "name": "Red LM",
        "token": "--is-color-red-lm",
        "value": "#df2749",
        "label": "#DF2749"
      },
      {
        "name": "Dark Red LM",
        "token": "--is-color-dark-red-lm",
        "value": "#be1938",
        "label": "#BE1938"
      },
      {
        "name": "Light Red DM",
        "token": "--is-color-light-red-dm",
        "value": "#ffcdce",
        "label": "#FFCDCE"
      },
      {
        "name": "Red DM",
        "token": "--is-color-red-dm",
        "value": "#e24d50",
        "label": "#E24D50"
      },
      {
        "name": "Dark Red DM",
        "token": "--is-color-dark-red-dm",
        "value": "#c03033",
        "label": "#C03033"
      }
    ]
  },
  {
    "section": "Status",
    "group": "Greens",
    "colors": [
      {
        "name": "Light Green LM",
        "token": "--is-color-light-green-lm",
        "value": "#b2f7db",
        "label": "#B2F7DB"
      },
      {
        "name": "Green LM",
        "token": "--is-color-green-lm",
        "value": "#28a574",
        "label": "#28A574"
      },
      {
        "name": "Light Green DM",
        "token": "--is-color-light-green-dm",
        "value": "#c8fae6",
        "label": "#C8FAE6"
      },
      {
        "name": "Green DM",
        "token": "--is-color-green-dm",
        "value": "#14b475",
        "label": "#14B475"
      }
    ]
  }
];
