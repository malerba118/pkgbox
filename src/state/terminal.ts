import { ITheme, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export class TerminalManager {
  terminal: Terminal;
  fitter: FitAddon;
  themes = {
    light: {
      background: "#FFFFFF",
      foreground: "#383a42",
      cursor: "#383a42",
      cursorAccent: "#ffffff",
      selectionBackground: "#b3d4fc",
      selectionForeground: "#000000",
      selectionInactiveBackground: "#d0d0d0",
      black: "#383a42",
      red: "#e45649",
      green: "#50a14f",
      yellow: "#c18401",
      blue: "#0184bc",
      magenta: "#a626a4",
      cyan: "#0997b3",
      white: "#fafafa",
      brightBlack: "#4f525e",
      brightRed: "#ff616e",
      brightGreen: "#58d1eb",
      brightYellow: "#f0a45d",
      brightBlue: "#61afef",
      brightMagenta: "#c577dd",
      brightCyan: "#56b6c2",
      brightWhite: "#ffffff",
    },
    dark: {
      background: "#181818", // Deep dark background similar to the code editor
      foreground: "#dcdcdc", // Light gray for text for clear readability
      cursor: "#a9a9a9", // Soft light gray for the cursor, not too stark
      cursorAccent: "#2d2d2d", // Darker accent for the cursor, for a subtle look
      selectionBackground: "#3c3f41", // Dark selection background, akin to the editor
      selectionForeground: "#ffffff", // White text on selection for contrast
      selectionInactiveBackground: "#2c2f31", // Slightly lighter than selection background
      black: "#000000", // Pure black for contrast
      red: "#ff6262", // Bright red for errors or warnings
      green: "#56b6c2", // Cyan-toned green, giving a modern feel
      yellow: "#ece94e", // Bright yellow for highlights
      blue: "#61afef", // A vivid blue, standing out against the dark background
      magenta: "#c678dd", // A bright purple for a pop of color
      cyan: "#2bbac5", // A bright but not overpowering cyan
      white: "#dcdcdc", // Same as the foreground, for consistency
      brightBlack: "#7f7f7f", // A medium gray for subdued elements
      brightRed: "#ff6262", // Same as red but can be used for different contexts
      brightGreen: "#98c379", // A lighter, lime green
      brightYellow: "#e5c07b", // A muted, orange-toned yellow
      brightBlue: "#61afef", // Same as blue, for consistency
      brightMagenta: "#c678dd", // Same as magenta, for consistency
      brightCyan: "#56b6c2", // Same as green, used interchangeably with green
      brightWhite: "#ffffff", // Bright white for the brightest highlights
      extendedAnsi: [
        /* your extended ANSI colors here */
      ],
    },
  };

  constructor() {
    this.terminal = new Terminal({
      convertEol: true,
    });
    this.terminal.options.theme = {
      background: "#F2F2F2",
      foreground: "#383a42",
      cursor: "#526eff",
      cursorAccent: "#ffffff",
      selectionBackground: "#b3d4fc",
      selectionForeground: "#000000",
      selectionInactiveBackground: "#d0d0d0",
      black: "#383a42",
      red: "#e45649",
      green: "#50a14f",
      yellow: "#c18401",
      blue: "#0184bc",
      magenta: "#a626a4",
      cyan: "#0997b3",
      white: "#fafafa",
      brightBlack: "#4f525e",
      brightRed: "#ff616e",
      brightGreen: "#58d1eb",
      brightYellow: "#f0a45d",
      brightBlue: "#61afef",
      brightMagenta: "#c577dd",
      brightCyan: "#56b6c2",
      brightWhite: "#ffffff",
    };
    // this.terminal.options.fontFamily = "var(--font-geist-mono)";
    this.terminal.options.fontSize = 15;
    this.fitter = new FitAddon();
    this.terminal.loadAddon(this.fitter);
  }

  mount(el: HTMLElement) {
    return this.terminal.open(el);
  }

  write(data: string) {
    this.terminal.write(data);
  }

  setTheme(theme: ITheme) {
    this.terminal.options.theme = theme;
  }

  reset() {
    this.terminal.reset();
  }
}
