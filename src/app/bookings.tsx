import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { PageHeading } from "../components/PageHeading";
import { Button, Empty, Icon, IconName, Notice, Sheet } from "../components/ui";
import {
  Booking,
  bookingTime,
  localDate,
  uid,
  useResident,
} from "../lib/store";
import { colors as c } from "../lib/theme";

const resources: {
  name: string;
  type: string;
  icon: IconName;
  color: string;
  description: string;
}[] = [
  {
    name: "Прачечная",
    type: "БЫТ БЕЗ ЗАБОТ",
    icon: "wind",
    color: c.lavender,
    description: "Выбери машинку и оставь время для себя.",
  },
  {
    name: "Учебная комната",
    type: "В РЕЖИМЕ ФОКУСА",
    icon: "book-open",
    color: c.lime,
    description: "Для дедлайнов, идей и совместных проектов.",
  },
  {
    name: "Общая кухня",
    type: "ВКУСНО БЫТЬ ВМЕСТЕ",
    icon: "coffee",
    color: c.peach,
    description: "Приготовь что-нибудь большее, чем лапша.",
  },
  {
    name: "Комната отдыха",
    type: "ВРЕМЯ ВЫДОХНУТЬ",
    icon: "smile",
    color: "#E0EAF2",
    description: "Вечер с друзьями или заслуженный перерыв.",
  },
];
const hours = Array.from({ length: 14 }, (_, i) => i + 8);
export default function Bookings() {
  const { width } = useWindowDimensions();
  const { bookings, commit } = useResident();
  const [selected, setSelected] = useState<number | null>(null);
  const [date, setDate] = useState(localDate(new Date(Date.now() + 86400000)));
  const [hour, setHour] = useState<number | null>(null);
  const [machine, setMachine] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [cancel, setCancel] = useState<Booking | null>(null);
  const resourceName =
    selected === 0
      ? "Стиральная машина №" + machine
      : selected !== null
        ? resources[selected].name
        : "";
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const unavailable = (h: number) =>
    bookingTime({ date, hour: h }) <= Date.now() ||
    bookings.some((b) => b.date === date && b.hour === h);
  const sorted = [...bookings].sort((a, b) => bookingTime(a) - bookingTime(b));
  async function save() {
    if (hour === null) {
      setError("Выбери время для своего плана.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await commit((data) => {
        if (bookingTime({ date, hour }) <= Date.now())
          throw new Error("Это время уже прошло. Выбери другой час.");
        if (data.bookings.some((b) => b.date === date && b.hour === hour))
          throw new Error(
            "На этот час у тебя уже есть план. Выбери другое время.",
          );
        return {
          ...data,
          bookings: [
            ...data.bookings,
            { id: uid(), resource: resourceName, date, hour },
          ],
        };
      });
      setSelected(null);
      setNotice(
        "План сохранён на устройстве. Доступность пространства нужно согласовать с общежитием.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <View>
      <PageHeading
        tag="МЕСТО ДЛЯ ТВОИХ ПЛАНОВ"
        title="Больше пространства для жизни."
        description="Тихий час за книгой, свежая стирка или ужин с друзьями — выбери, чем займёшься сегодня."
      />
      <View style={s.grid}>
        {resources.map((r, i) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={"Выбрать: " + r.name}
            key={r.name}
            onPress={() => {
              setSelected(i);
              setHour(null);
              setError("");
              setMachine(1);
            }}
            style={({ pressed }) => [
              s.card,
              {
                width: width >= 1000 ? "23.7%" : width >= 600 ? "48%" : "100%",
              },
              pressed && { borderColor: c.purple },
            ]}
          >
            <View style={[s.illustration, { backgroundColor: r.color }]}>
              <View style={s.iconCircle}>
                <Icon name={r.icon} size={40} />
              </View>
              <Text style={s.illustrationStar}>✳</Text>
            </View>
            <View style={s.cardBody}>
              <Text style={s.tag}>{r.type}</Text>
              <Text style={s.name}>{r.name}</Text>
              <Text style={s.description}>{r.description}</Text>
              <View style={s.cardFooter}>
                <Text style={s.duration}>Сеанс · 1 час</Text>
                <View style={s.arrow}>
                  <Icon name="arrow-up-right" size={18} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={s.listHeading}>
        <Text style={s.listTitle}>Мои бронирования</Text>
        <Text style={s.localLabel}>Личные планы</Text>
      </View>
      {notice ? <Notice>{notice}</Notice> : null}
      <View style={s.list}>
        {!bookings.length ? (
          <Empty
            icon="calendar"
            title="Всё самое интересное — впереди"
            description="Выбери пространство выше и добавь первый план в своё расписание."
          />
        ) : (
          sorted.map((b) => {
            const past = bookingTime(b) <= Date.now();
            return (
              <View key={b.id} style={s.booking}>
                <View style={s.bookingIcon}>
                  <Icon name="calendar" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.bookingName}>{b.resource}</Text>
                  <Text style={s.bookingDate}>
                    {new Date(b.date + "T12:00:00").toLocaleDateString(
                      "ru-RU",
                      { day: "numeric", month: "long" },
                    )}{" "}
                    · {b.hour}:00–{b.hour + 1}:00
                  </Text>
                  <Text style={s.bookingStatus}>
                    {past ? "Прошедший план" : "Запланировано на устройстве"}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={"Удалить план: " + b.resource}
                  onPress={() => {
                    setCancel(b);
                    setError("");
                  }}
                  style={s.remove}
                >
                  <Icon name="x" size={19} />
                </Pressable>
              </View>
            );
          })
        )}
      </View>
      <Notice>
        Это личное расписание на устройстве. Оно не занимает ресурс для других
        жильцов: общая доступность и подтверждение общежития пока не подключены.
      </Notice>
      {selected !== null && (
        <Sheet
          title={resources[selected].name}
          onClose={() => {
            if (!busy) setSelected(null);
          }}
        >
          {selected === 0 && (
            <>
              <Text style={s.label}>Стиральная машина</Text>
              <View style={s.chips}>
                {[1, 2, 3].map((n) => (
                  <Pressable
                    key={n}
                    accessibilityRole="button"
                    accessibilityState={{ selected: machine === n }}
                    onPress={() => setMachine(n)}
                    style={[s.chip, machine === n && s.selected]}
                  >
                    <Text style={[s.chipText, machine === n && s.selectedText]}>
                      Машина {n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
          <Text style={s.label}>Выбери день</Text>
          <View style={s.chips}>
            {days.map((d) => {
              const value = localDate(d);
              const active = date === value;
              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={d.toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    setDate(value);
                    setHour(null);
                  }}
                  style={[s.day, active && s.selected]}
                >
                  <Text style={[s.dayWeek, active && s.selectedText]}>
                    {d.toLocaleDateString("ru-RU", { weekday: "short" })}
                  </Text>
                  <Text style={[s.dayNumber, active && s.selectedText]}>
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={s.label}>Начало сеанса · 1 час</Text>
          <View style={s.chips}>
            {hours.map((h) => {
              const blocked = unavailable(h);
              return (
                <Pressable
                  key={h}
                  accessibilityRole="button"
                  accessibilityLabel={h + ":00"}
                  accessibilityState={{
                    selected: hour === h,
                    disabled: blocked,
                  }}
                  disabled={blocked}
                  onPress={() => {
                    setHour(h);
                    setError("");
                  }}
                  style={[
                    s.chip,
                    hour === h && s.selected,
                    blocked && s.disabled,
                  ]}
                >
                  <Text
                    style={[
                      s.chipText,
                      hour === h && s.selectedText,
                      blocked && {
                        color: c.muted,
                        textDecorationLine: "line-through",
                      },
                    ]}
                  >
                    {h}:00
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={s.helper}>
            Прошедшее время и часы, на которые у тебя уже есть планы,
            недоступны.
          </Text>
          {error && <Notice error>{error}</Notice>}
          <Button disabled={busy} onPress={save} icon="check">
            {busy ? "Сохраняем…" : "Добавить в мои планы"}
          </Button>
          <Text style={s.helper}>
            План сохраняется только на устройстве. Для использования
            пространства согласуй время с общежитием.
          </Text>
        </Sheet>
      )}
      {cancel && (
        <Sheet
          title="Убрать план из расписания?"
          onClose={() => {
            if (!busy) setCancel(null);
          }}
        >
          <Text style={s.description}>
            {cancel.resource} · {cancel.hour}:00–{cancel.hour + 1}:00
          </Text>
          {error && <Notice error>{error}</Notice>}
          <Button
            disabled={busy}
            icon="trash-2"
            onPress={async () => {
              setBusy(true);
              try {
                await commit((d) => ({
                  ...d,
                  bookings: d.bookings.filter((b) => b.id !== cancel.id),
                }));
                setCancel(null);
                setNotice("План удалён из твоего расписания.");
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Удаляем…" : "Удалить план"}
          </Button>
        </Sheet>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 20,
    backgroundColor: c.white,
    overflow: "hidden",
  },
  illustration: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "#35223F25",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-8deg" }],
  },
  illustrationStar: {
    position: "absolute",
    right: 15,
    top: 10,
    color: "#35223F30",
    fontSize: 48,
  },
  cardBody: { padding: 22 },
  tag: { color: c.purple, fontSize: 8, fontWeight: "700", letterSpacing: 1.3 },
  name: {
    color: c.ink,
    fontWeight: "700",
    fontSize: 20,
    marginTop: 12,
    letterSpacing: -0.6,
  },
  description: { fontSize: 13, color: c.muted, lineHeight: 22, marginTop: 10 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  duration: { color: c.muted, fontSize: 11 },
  arrow: { padding: 9, backgroundColor: c.cream, borderRadius: 25 },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  listTitle: {
    color: c.ink,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  localLabel: {
    color: c.purple,
    backgroundColor: c.lavender,
    borderRadius: 20,
    fontSize: 11,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  list: {
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  booking: {
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  bookingIcon: { backgroundColor: c.lime, borderRadius: 14, padding: 13 },
  bookingName: { fontWeight: "700", color: c.ink, fontSize: 16 },
  bookingDate: { color: c.muted, fontSize: 13, marginTop: 5 },
  bookingStatus: { color: c.purple, fontSize: 10, marginTop: 8 },
  remove: { padding: 10, borderRadius: 30, backgroundColor: c.cream },
  label: { color: c.ink, fontWeight: "600", fontSize: 13 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 70,
    alignItems: "center",
  },
  chipText: { color: c.ink, fontSize: 13 },
  selected: { backgroundColor: c.ink, borderColor: c.ink },
  selectedText: { color: c.white },
  disabled: { backgroundColor: c.cream, opacity: 0.5 },
  day: {
    minWidth: 52,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 5,
  },
  dayWeek: { color: c.muted, fontSize: 10 },
  dayNumber: { color: c.ink, fontSize: 18, fontWeight: "600" },
  helper: { color: c.muted, fontSize: 12, lineHeight: 19 },
});
