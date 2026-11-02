import { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { PageHeading } from "../components/PageHeading";
import { Button, Field, Icon, Notice } from "../components/ui";
import { useResident } from "../lib/store";
import { colors as c } from "../lib/theme";

export default function Profile() {
  const { width } = useWindowDimensions();
  const { profile, commit, requests, bookings } = useResident();
  const [name, setName] = useState(profile.name);
  const [room, setRoom] = useState(profile.room);
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const change = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setSuccess(false);
    setError("");
  };
  async function save() {
    if (name.trim().length < 2) {
      setError("Введи имя — минимум 2 символа.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Проверь адрес электронной почты.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await commit((d) => ({
        ...d,
        profile: {
          name: name.trim(),
          room: room.trim(),
          email: email.trim().toLowerCase(),
        },
      }));
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <View>
      <PageHeading
        tag="ТВОЙ ЛИЧНЫЙ УГОЛОК"
        title="Хорошо быть собой."
        description="Пусть DormLife знает, как к тебе обращаться. Здесь всё самое важное о тебе и твоей комнате."
      />
      <View style={[s.columns, width < 760 && { flexDirection: "column" }]}>
        <View style={[s.profileCard, width < 760 && { width: "100%" }]}>
          <View style={s.ornament}>
            <Text style={s.star}>✳</Text>
            <Icon name="home" size={25} color={c.lime} />
          </View>
          <View style={s.avatar}>
            <Text style={s.initial}>
              {profile.name ? profile.name[0].toUpperCase() : "Я"}
            </Text>
          </View>
          <Text style={s.name}>{profile.name || "Привет, сосед!"}</Text>
          <Text style={s.role}>Часть большой студенческой истории</Text>
          <View style={s.room}>
            <Icon name="key" size={18} color={c.lime} />
            <Text style={s.roomText}>
              {profile.room ? "Комната " + profile.room : "Укажи свою комнату"}
            </Text>
          </View>
          <View style={s.stats}>
            <View>
              <Text style={s.number}>{requests.length}</Text>
              <Text style={s.statLabel}>заявок</Text>
            </View>
            <View style={s.divider} />
            <View>
              <Text style={s.number}>{bookings.length}</Text>
              <Text style={s.statLabel}>планов</Text>
            </View>
          </View>
        </View>
        <View style={s.form}>
          <Text style={s.formTitle}>Личные данные</Text>
          <Text style={s.formDescription}>
            Небольшое знакомство — и всё на своих местах.
          </Text>
          <Field
            label="Как тебя зовут?"
            value={name}
            onChangeText={change(setName)}
            placeholder="Твоё имя"
            maxLength={80}
          />
          <Field
            label="Номер комнаты"
            value={room}
            onChangeText={change(setRoom)}
            placeholder="Например, 304Б"
            maxLength={20}
          />
          <Field
            label="Электронная почта (необязательно)"
            value={email}
            onChangeText={change(setEmail)}
            placeholder="student@university.kz"
            keyboardType="email-address"
            maxLength={150}
          />
          {error && <Notice error>{error}</Notice>}
          {success && (
            <Notice>
              Профиль сохранён. Рады знакомству, {name.trim().split(" ")[0]}!
            </Notice>
          )}
          <Button disabled={busy} onPress={save} icon="check">
            {busy ? "Сохраняем…" : "Сохранить изменения"}
          </Button>
          <Text style={s.privacy}>
            <Text>♧ </Text>Данные остаются на этом устройстве. Это личный
            профиль, без регистрации и отправки данных на сервер.
          </Text>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  columns: { flexDirection: "row", gap: 28, alignItems: "flex-start" },
  profileCard: {
    width: "35%",
    backgroundColor: c.ink,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  ornament: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  star: { color: c.lime, fontSize: 48 },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: c.lime,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  initial: { color: c.ink, fontSize: 40, fontWeight: "700" },
  name: {
    color: c.white,
    fontWeight: "700",
    fontSize: 27,
    textAlign: "center",
    marginTop: 23,
  },
  role: {
    color: "#D0C3D8",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },
  room: {
    marginTop: 25,
    backgroundColor: "#FFFFFF12",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  roomText: {
    color: c.ink,
    backgroundColor: c.lime,
    padding: 7,
    borderRadius: 8,
    fontSize: 12,
  },
  stats: {
    marginTop: 30,
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF25",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
  },
  number: {
    color: c.lime,
    fontSize: 29,
    textAlign: "center",
    fontWeight: "600",
  },
  statLabel: {
    color: "#D0C3D8",
    textAlign: "center",
    fontSize: 12,
    marginTop: 6,
  },
  divider: { width: 1, backgroundColor: "#FFFFFF25" },
  form: {
    flex: 1,
    width: "100%",
    backgroundColor: c.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.line,
    padding: 28,
  },
  formTitle: { fontSize: 22, color: c.ink, fontWeight: "700" },
  formDescription: {
    color: c.muted,
    fontSize: 13,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 27,
  },
  privacy: { color: c.muted, fontSize: 12, lineHeight: 21, marginTop: 20 },
});
