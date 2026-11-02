import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Icon, IconName, Sheet } from "../components/ui";
import { bookingTime, useResident } from "../lib/store";
import { colors as c } from "../lib/theme";

const guides = [
  {
    tag: "ТВОЁ ПРОСТРАНСТВО",
    title: "Маленькая комната.\nБольшие возможности.",
    text: "Несколько простых идей, чтобы почувствовать себя дома.",
    icon: "sun" as IconName,
    body: "Начни с того, что делает пространство твоим: любимая кружка, фотографии и мягкий свет.\n\nРаздели комнату на зоны: стол — для учёбы, кровать — для отдыха. Коробки под кроватью и настенные органайзеры помогут освободить место.\n\nДоговорись с соседом о тихих часах и уборке. Уют начинается с уважения друг к другу.",
  },
  {
    tag: "ВМЕСТЕ ЛУЧШЕ",
    title: "Соседи сегодня.\nДрузья на всю жизнь.",
    text: "Общие пространства для твоих новых историй.",
    icon: "users" as IconName,
    body: "Предложи соседям вместе приготовить ужин или устроить вечер настольных игр. Не нужно ждать особого повода, чтобы познакомиться.\n\nДля совместных занятий можно запланировать время в учебной комнате, а для отдыха — в общей гостиной.\n\nУважай личные границы и заранее согласовывай встречи с теми, кто живёт рядом.",
  },
];

export default function Home() {
  const { width } = useWindowDimensions();
  const small = width < 760;
  const { profile, requests, bookings } = useResident();
  const [guide, setGuide] = useState<number | null>(null);
  const upcoming = bookings
    .filter((b) => bookingTime(b) > Date.now())
    .sort((a, b) => bookingTime(a) - bookingTime(b));
  const next = upcoming[0];
  const actions = [
    {
      icon: "tool" as IconName,
      title: "Что-то сломалось?",
      text: "Расскажи, с чем нужна помощь",
      label: "Создать заявку",
      color: c.lavender,
      route: "/requests" as const,
    },
    {
      icon: "calendar" as IconName,
      title: "Время для твоих планов",
      text: "Стирка, учёба или вечер с друзьями",
      label: "Выбрать пространство",
      color: c.lime,
      route: "/bookings" as const,
    },
    {
      icon: "home" as IconName,
      title: "Твой уголок",
      text: profile.room
        ? "Комната " + profile.room + " · всё о тебе"
        : "Данные профиля и твоя комната",
      label: "Открыть профиль",
      color: c.peach,
      route: "/profile" as const,
    },
  ];
  return (
    <View>
      <View style={s.eyebrowRow}>
        <View style={s.dot} />
        <Text style={s.eyebrow}>СТУДЕНЧЕСКАЯ ЖИЗНЬ, КАК ОНА ЕСТЬ</Text>
      </View>
      <View style={[s.hero, small && s.column]}>
        <View style={[s.heroCopy, small && { width: "100%" }]}>
          <Text
            accessibilityRole="header"
            style={[s.title, small && { fontSize: 47, lineHeight: 52 }]}
          >
            Место, где{"\n"}ты — <Text style={s.titleAccent}>дома.</Text>
          </Text>
          <Text style={s.intro}>
            Учись, знакомься, строй планы.{"\n"}А бытовые мелочи оставь
            DormLife.
          </Text>
          <View style={s.heroButtons}>
            <Button onPress={() => router.push("/bookings")}>
              Найти своё пространство
            </Button>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push("/requests")}
              style={s.textLink}
            >
              <Text style={s.textLinkLabel}>Нужна помощь?</Text>
              <Icon name="arrow-right" size={17} />
            </Pressable>
          </View>
          <View style={s.heroNote}>
            <View style={s.noteIcon}>
              <Icon name="heart" size={14} />
            </View>
            <Text style={s.noteText}>Меньше забот. Больше студенчества.</Text>
          </View>
        </View>
        <View
          style={[
            s.visual,
            small && { width: "100%", height: 285, marginTop: 12 },
          ]}
        >
          <View style={s.photoFrame}>
            <Image
              source={require("../../assets/images/student-life.jpg")}
              style={s.heroImage}
              resizeMode="cover"
            />
            <View style={s.photoTint} />
            <View style={s.photoCaption}>
              <Text style={s.photoSmall}>MAKE YOURSELF</Text>
              <Text style={s.photoTitle}>at home.</Text>
            </View>
          </View>
          <View style={s.star}>
            <Text style={s.starText}>✳︎</Text>
          </View>
          <View style={s.floating}>
            <View style={s.floatingIcon}>
              <Icon name="coffee" size={23} />
            </View>
            <View>
              <Text style={s.floatingTitle}>Твои лучшие годы.</Text>
              <Text style={s.floatingSub}>Твоё место для них.</Text>
            </View>
          </View>
          <View style={s.roundNote}>
            <Icon name="arrow-down-right" size={28} color={c.white} />
            <Text style={s.roundNoteText}>ЖИВИ{"\n"}НА ПОЛНУЮ</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          s.welcome,
          small && {
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 16,
          },
        ]}
      >
        <View>
          <Text style={s.welcomeTitle}>
            Привет, {profile.name ? profile.name.split(" ")[0] : "сосед"}!{" "}
            <Text style={{ fontSize: 23 }}>✺</Text>
          </Text>
          <Text style={s.welcomeSub}>Что сделаем сегодня?</Text>
        </View>
        <View style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statNumber}>
              {String(requests.length).padStart(2, "0")}
            </Text>
            <Text style={s.statLabel}>сохранённых заявок</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNumber}>
              {String(upcoming.length).padStart(2, "0")}
            </Text>
            <Text style={s.statLabel}>планов впереди</Text>
          </View>
        </View>
      </View>
      <View style={[s.actions, small && s.column]}>
        {actions.map((a) => (
          <Pressable
            key={a.title}
            accessibilityRole="link"
            onPress={() => router.push(a.route)}
            style={({ pressed }) => [
              s.action,
              small && { width: "100%" },
              pressed && {
                borderColor: c.purple,
                transform: [{ translateY: -3 }],
              },
            ]}
          >
            <View style={s.actionTop}>
              <View style={[s.actionIcon, { backgroundColor: a.color }]}>
                <Icon name={a.icon} size={24} />
              </View>
              <Icon name="arrow-up-right" size={21} color={c.muted} />
            </View>
            <Text style={s.actionTitle}>{a.title}</Text>
            <Text style={s.actionText}>{a.text}</Text>
            <Text style={s.actionLabel}>{a.label} →</Text>
          </Pressable>
        ))}
      </View>
      {next && (
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push("/bookings")}
          style={s.nextBooking}
        >
          <Icon name="clock" />
          <View style={{ flex: 1 }}>
            <Text style={s.nextTitle}>В твоих планах: {next.resource}</Text>
            <Text style={s.nextText}>
              {new Date(next.date + "T12:00:00").toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
              })}
              , {next.hour}:00–{next.hour + 1}:00 · сохранено на устройстве
            </Text>
          </View>
          <Icon name="arrow-right" />
        </Pressable>
      )}
      <View style={s.sectionHeading}>
        <View>
          <Text style={s.eyebrow}>НЕ ТОЛЬКО ЧЕТЫРЕ СТЕНЫ</Text>
          <Text
            accessibilityRole="header"
            style={[s.sectionTitle, small && { fontSize: 29 }]}
          >
            Здесь начинается твоё.
          </Text>
        </View>
        <Text style={s.sectionDecoration}>✳︎</Text>
      </View>
      <View style={[s.guides, small && s.column]}>
        {guides.map((g, i) => (
          <Pressable
            key={g.tag}
            accessibilityRole="button"
            onPress={() => setGuide(i)}
            style={({ pressed }) => [
              s.guide,
              i === 1 && { backgroundColor: c.lime },
              small && { width: "100%" },
              pressed && { opacity: 0.9 },
            ]}
          >
            <View style={s.guideTop}>
              <Text style={[s.guideTag, i === 0 && { color: "#DCD0E4" }]}>
                {g.tag}
              </Text>
              <Icon name={g.icon} size={30} color={i === 0 ? c.lime : c.ink} />
            </View>
            <Text style={[s.guideTitle, i === 0 && { color: c.white }]}>
              {g.title}
            </Text>
            <View style={s.guideBottom}>
              <Text style={[s.guideText, i === 0 && { color: "#DCD0E4" }]}>
                {g.text}
              </Text>
              <View
                style={[s.guideArrow, i === 0 && { borderColor: "#776184" }]}
              >
                <Icon name="arrow-up-right" color={i === 0 ? c.white : c.ink} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
      {guide !== null && (
        <Sheet
          title={guides[guide].title.replace("\n", " ")}
          onClose={() => setGuide(null)}
        >
          <Text style={s.article}>{guides[guide].body}</Text>
          <Button
            onPress={() => {
              setGuide(null);
              router.push("/bookings");
            }}
          >
            Посмотреть пространства
          </Button>
        </Sheet>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 7, height: 7, backgroundColor: c.purple, borderRadius: 5 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: c.purple,
    letterSpacing: 1.7,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    paddingTop: 25,
    paddingBottom: 53,
  },
  column: { flexDirection: "column", alignItems: "stretch" },
  heroCopy: { width: "54%", paddingVertical: 15 },
  title: {
    fontSize: 72,
    lineHeight: 78,
    letterSpacing: -3.5,
    fontWeight: "800",
    color: c.ink,
  },
  titleAccent: { color: c.purple },
  intro: { color: c.muted, fontSize: 17, lineHeight: 28, marginTop: 22 },
  heroButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 22,
    marginTop: 28,
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  textLinkLabel: { fontSize: 13, color: c.ink, fontWeight: "600" },
  heroNote: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 24,
  },
  noteIcon: { backgroundColor: c.lime, padding: 5, borderRadius: 20 },
  noteText: { fontSize: 11, color: c.muted },
  visual: { width: "42%", height: 365, marginRight: 4 },
  photoFrame: {
    position: "absolute",
    top: 10,
    bottom: 10,
    right: 0,
    left: 20,
    overflow: "hidden",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 26,
    backgroundColor: c.peach,
  },
  heroImage: { width: "100%", height: "100%" },
  photoTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "#35223F20" },
  photoCaption: { position: "absolute", left: 28, top: "27%" },
  photoSmall: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 4,
    color: c.ink,
  },
  photoTitle: {
    fontSize: 48,
    letterSpacing: -2,
    color: c.ink,
    fontWeight: "800",
  },
  star: {
    position: "absolute",
    right: -4,
    top: -15,
    transform: [{ rotate: "12deg" }],
  },
  starText: { fontSize: 95, lineHeight: 110, color: c.purple },
  floating: {
    position: "absolute",
    bottom: 25,
    left: -10,
    backgroundColor: c.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    boxShadow: "0px 8px 30px #35223F12",
  },
  floatingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: c.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingTitle: { fontSize: 13, color: c.ink, fontWeight: "700" },
  floatingSub: { fontSize: 11, color: c.muted, marginTop: 4 },
  roundNote: {
    position: "absolute",
    right: -5,
    bottom: -10,
    width: 103,
    height: 103,
    borderRadius: 55,
    backgroundColor: c.purple,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    transform: [{ rotate: "10deg" }],
  },
  roundNoteText: {
    color: c.white,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 14,
    letterSpacing: 1,
  },
  welcome: {
    paddingTop: 27,
    borderTopWidth: 1,
    borderTopColor: c.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  welcomeTitle: {
    color: c.ink,
    fontWeight: "700",
    fontSize: 25,
    letterSpacing: -0.7,
  },
  welcomeSub: { fontSize: 13, color: c.muted, marginTop: 5 },
  stats: { flexDirection: "row", gap: 25, alignItems: "center" },
  stat: { flexDirection: "row", alignItems: "center", gap: 9 },
  statNumber: {
    color: c.purple,
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: -1,
  },
  statLabel: { color: c.muted, fontSize: 11, maxWidth: 100, lineHeight: 16 },
  statDivider: { height: 30, width: 1, backgroundColor: c.line },
  actions: { flexDirection: "row", gap: 18 },
  action: {
    flex: 1,
    backgroundColor: c.white,
    borderRadius: 19,
    padding: 25,
    borderWidth: 1,
    borderColor: c.line,
  },
  actionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 23,
  },
  actionIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: c.ink,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  actionText: { color: c.muted, fontSize: 12, lineHeight: 20, marginTop: 8 },
  actionLabel: {
    color: c.purple,
    fontWeight: "700",
    fontSize: 12,
    marginTop: 25,
  },
  nextBooking: {
    backgroundColor: c.lavender,
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  nextTitle: { color: c.ink, fontWeight: "700", fontSize: 14 },
  nextText: { color: c.muted, fontSize: 12, marginTop: 6 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 58,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 34,
    color: c.ink,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: 10,
  },
  sectionDecoration: { color: c.purple, fontSize: 59 },
  guides: { flexDirection: "row", gap: 20 },
  guide: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: c.ink,
    padding: 28,
    overflow: "hidden",
  },
  guideTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guideTag: {
    color: c.ink,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  guideTitle: {
    color: c.ink,
    fontWeight: "700",
    fontSize: 27,
    lineHeight: 35,
    letterSpacing: -0.6,
    marginTop: 24,
    marginBottom: 20,
  },
  guideBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
  },
  guideText: {
    flex: 1,
    color: c.ink,
    fontSize: 12,
    lineHeight: 20,
    maxWidth: 280,
  },
  guideArrow: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#9CAD5E",
    alignItems: "center",
    justifyContent: "center",
  },
  article: { fontSize: 16, color: c.muted, lineHeight: 27 },
});
