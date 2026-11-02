import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ResidentProvider } from "../lib/store";
import { Shell } from "../components/Shell";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ResidentProvider>
        <StatusBar style="dark" />
        <Shell>
          <Slot />
        </Shell>
      </ResidentProvider>
    </SafeAreaProvider>
  );
}
