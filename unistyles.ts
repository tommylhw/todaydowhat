import { StyleSheet } from "react-native-unistyles";
const lightTheme = {
  colors: {
    primary: "#36328C",
    secondary: "#FFDF76",
    tertiary: "#75BAEC",
    surface: "#F9F9F9",
    // any nesting, spreading, arrays, etc.
  },
};

const darkTheme = {
  colors: {
    primary: "#ff1ff4",
    secondary: "#1ff4ff",
    // any nesting, spreading, arrays, etc.
  },
};

const appThemes = {
  light: lightTheme,
  other: darkTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: appThemes,
  settings: {
    initialTheme: "light",
  },
});
