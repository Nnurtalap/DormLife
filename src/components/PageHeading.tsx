import { StyleSheet, Text, View } from "react-native";
import { colors as c } from "../lib/theme";

export function PageHeading({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <View style={s.heading}>
      <Text style={s.tag}>{tag}</Text>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      <Text style={s.description}>{description}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  heading: { gap: 13, marginBottom: 32 },
  tag: { color: c.purple, fontWeight: "700", fontSize: 10, letterSpacing: 1.8 },
  title: { fontSize: 42, fontWeight: "800", color: c.ink, letterSpacing: -1.7 },
  description: { color: c.muted, fontSize: 15, lineHeight: 24, maxWidth: 580 },
});
