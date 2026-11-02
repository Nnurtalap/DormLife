import { router } from "expo-router";
import { View } from "react-native";
import { Button, Empty } from "../components/ui";

export default function NotFound() {
  return (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <Empty
        icon="compass"
        title="Кажется, ты немного заблудился"
        description="Такой страницы нет. Вернёмся туда, где всё знакомо?"
      />
      <Button onPress={() => router.replace("/")} icon="home">
        На главную
      </Button>
    </View>
  );
}
