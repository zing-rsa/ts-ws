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
                'background': 'background: rgb(51,51,51); background: linear-gradient(317deg, rgba(51,51,51,1) 12%, rgba(66,66,66,1) 95%);',
                'primary': 'background: rgb(25,25,25); background: linear-gradient(4deg, rgba(25,25,25,1) 12%, rgba(57,57,57,1) 95%);',
                'secondary': 'background: rgb(25,25,25); background: linear-gradient(4deg, rgba(25,25,25,1) 12%, rgba(0,0,0,1) 95%);',
                'tertiary': '#191919',
                'btn-primary': '#000000',
                'btn-secondary': '#b3cae5',
                // 'accent': '#383838',
                'accent': 'background: rgb(41,0,0); background: linear-gradient(90deg, rgba(41,0,0,1) 12%, rgba(0,0,0,1) 95%);'
            },
            backgroundImage: {
                'chat-tile': "url(/topo.svg)",
                'index-tile': "url(/topolight.svg)"
            }
        }
    }
  }),
  selfURL: import.meta.url,
};