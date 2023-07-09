import { defineConfig } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.7";

export default {
  ...defineConfig({
    presets: [presetTailwind(), presetAutoprefix()],
    theme: {
        fontFamily: {
            'roboto': ['Roboto', 'Arial', 'sans-serif'],
            'inter': ['Inter', 'Arial', 'sans-serif'],
        },
        extend: {
            colors: {
                'text': '#000000',
                'text-light': '#d9e4f2',
                'background': '#d9e4f2',
                'primary': '#2b507d',
                'secondary': '#b3cae5',
                'tertiary': '#acb4bd',
                'accent': '#0e1425',
            },
            backgroundImage: {
                'chat-tile': "url(/topo.svg)"
            }
        }
    }
  }),
  selfURL: import.meta.url,
};