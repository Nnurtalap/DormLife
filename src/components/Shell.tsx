import { router, usePathname } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors as c } from "../lib/theme";
import { useResident } from "../lib/store";
import { Icon, IconName, Notice } from "./ui";

const links = [
  { href: "/" as const, label: "Главная", icon: "grid" as IconName },
  { href: "/requests" as const, label: "Заявки", icon: "tool" as IconName },
  {
    href: "/bookings" as const,
    label: "Бронирование",
    icon: "calendar" as IconName,
  },
  { href: "/profile" as const, label: "Профиль", icon: "user" as IconName },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const mobile = width < 1000;
  const path = usePathname();
  const { ready, error, profile } = useResident();
  const navigation = (bottom = false) =>
    links.map((item) => (
      <Pressable
        key={item.href}
        onPress={() => router.push(item.href)}
        accessibilityRole="link"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: path === item.href }}
        style={[
          s.navItem,
          bottom && s.bottomItem,
          path === item.href && !bottom && s.active,
        ]}
      >
        {(bottom || path === item.href) && (
          <Icon
            name={item.icon}
            size={bottom ? 21 : 16}
            color={path === item.href ? c.ink : c.muted}
          />
        )}
        <Text
          style={[
            s.navText,
            bottom && s.bottomText,
            path === item.href && { color: c.ink, fontWeight: "700" },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    ));
  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={s.header}>
        <View style={[s.headerInner, mobile && { paddingHorizontal: 22 }]}>
          <Pressable
            onPress={() => router.push("/")}
            accessibilityRole="link"
            accessibilityLabel="DormLife — главная"
            style={s.logo}
          >
            <View style={s.logoMark}>
              <Icon name="home" size={22} />
            </View>
            <Text style={s.wordmark}>
              dorm<Text style={{ fontWeight: "400" }}>life</Text>
              <Text style={{ color: c.purple }}>.</Text>
            </Text>
          </Pressable>
          {!mobile && <View style={s.nav}>{navigation()}</View>}
          <Pressable
            onPress={() => router.push("/profile")}
            accessibilityRole="link"
            accessibilityLabel="Открыть мой профиль"
            style={s.profile}
          >
            <Text style={s.avatar}>
              {profile.name ? profile.name[0].toUpperCase() : "Я"}
            </Text>
            {!mobile && (
              <>
                <Text style={s.profileLabel}>Мой кабинет</Text>
                <Icon name="chevron-down" size={15} />
              </>
            )}
          </Pressable>
        </View>
      </View>
      <ScrollView
        key={path}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            s.content,
            mobile && { paddingHorizontal: 22, paddingTop: 28 },
          ]}
        >
          {error ? (
            <Notice error>{error}</Notice>
          ) : !ready ? (
            <ActivityIndicator
              size="large"
              color={c.purple}
              style={{ margin: 50 }}
            />
          ) : (
            children
          )}
        </View>
        <View style={s.footer}>
          <View style={[s.footerInner, mobile && { paddingHorizontal: 22 }]}>
            <Text style={s.footerBrand}>dormlife.</Text>
            <Text style={s.footerText}>Больше, чем просто общежитие.</Text>
            <Text style={s.footerText}>Сделано для студенческой жизни ↗</Text>
          </View>
        </View>
      </ScrollView>
      {mobile && <View style={s.bottom}>{navigation(true)}</View>}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.cream },
  header: {
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1280,
    marginHorizontal: "auto",
    paddingHorizontal: 48,
    height: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  logo: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoMark: { backgroundColor: c.lime, padding: 9, borderRadius: 13 },
  wordmark: {
    fontSize: 29,
    fontWeight: "800",
    color: c.ink,
    letterSpacing: -1.3,
  },
  nav: { flexDirection: "row", gap: 5 },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  active: { backgroundColor: c.lavender },
  navText: { color: c.muted, fontSize: 13 },
  profile: { flexDirection: "row", gap: 9, alignItems: "center" },
  avatar: {
    width: 34,
    height: 34,
    lineHeight: 34,
    textAlign: "center",
    borderRadius: 20,
    backgroundColor: c.peach,
    color: c.ink,
    fontWeight: "700",
    overflow: "hidden",
  },
  profileLabel: { color: c.ink, fontSize: 12, fontWeight: "600" },
  content: {
    width: "100%",
    maxWidth: 1280,
    paddingHorizontal: 48,
    paddingTop: 42,
    paddingBottom: 64,
    marginHorizontal: "auto",
    flex: 1,
  },
  footer: { borderTopWidth: 1, borderTopColor: c.line },
  footerInner: {
    maxWidth: 1280,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 48,
    paddingVertical: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  footerBrand: {
    fontWeight: "800",
    fontSize: 22,
    color: c.ink,
    letterSpacing: -1,
  },
  footerText: { color: c.muted, fontSize: 12 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: c.white,
    borderTopColor: c.line,
    borderTopWidth: 1,
  },
  bottomItem: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: "column",
    gap: 5,
  },
  bottomText: { fontSize: 10 },
});
