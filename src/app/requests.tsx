import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PageHeading } from "../components/PageHeading";
import { Button, Empty, Field, Icon, Notice, Sheet } from "../components/ui";
import { uid, useResident } from "../lib/store";
import { colors as c } from "../lib/theme";

const categories = ["Сантехника", "Электрика", "Мебель", "Другое"];
export default function Requests() {
  const { requests, commit } = useResident();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const save = async () => {
    if (description.trim().length < 10) {
      setError("Опиши проблему подробнее — минимум 10 символов.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await commit((data) => ({
        ...data,
        requests: [
          {
            id: uid(),
            category,
            description: description.trim(),
            createdAt: new Date().toISOString(),
          },
          ...data.requests,
        ],
      }));
      setOpen(false);
      setDescription("");
      setNotice("Черновик сохранён. Отправка сотруднику пока не подключена.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <View>
      <PageHeading
        tag="БЫТОВЫЕ ВОПРОСЫ — ПРОЩЕ"
        title="Позаботимся о доме."
        description="Не работает розетка или протекает кран? Сохрани описание проблемы, чтобы ничего не забыть."
      />
      <View style={s.toolbar}>
        <Text style={s.count}>
          Мои заявки <Text style={s.badge}>{requests.length}</Text>
        </Text>
        <Button
          onPress={() => {
            setError("");
            setCategory(categories[0]);
            setOpen(true);
          }}
          icon="plus"
        >
          Создать заявку
        </Button>
      </View>
      {notice ? <Notice>{notice}</Notice> : null}
      <View style={s.list}>
        {!requests.length ? (
          <Empty
            icon="tool"
            title="Пока всё в порядке"
            description="Здесь появятся твои заявки. Если нужна помощь, начни с описания проблемы."
          />
        ) : (
          requests.map((r) => (
            <View key={r.id} style={s.request}>
              <View style={s.row}>
                <View style={s.category}>
                  <Icon name="tool" size={18} />
                  <Text style={s.categoryText}>{r.category}</Text>
                </View>
                <Text style={s.status}>Черновик</Text>
              </View>
              <Text style={s.description}>{r.description}</Text>
              <View style={s.row}>
                <Text style={s.date}>
                  {new Date(r.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={"Удалить заявку: " + r.description}
                  onPress={() => {
                    setError("");
                    setDeleting(r.id);
                  }}
                  style={s.delete}
                >
                  <Icon name="trash-2" size={15} color={c.muted} />
                  <Text style={s.deleteText}>Удалить</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
      <Notice>
        Заявки сохраняются только на этом устройстве. Передача сотрудникам и
        отслеживание статуса появятся после подключения сервера.
      </Notice>
      {open && (
        <Sheet
          title="С чем нужна помощь?"
          onClose={() => {
            if (!busy) setOpen(false);
          }}
        >
          <Text style={s.label}>Категория</Text>
          <View style={s.chips}>
            {categories.map((v) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: category === v }}
                key={v}
                onPress={() => setCategory(v)}
                style={[s.chip, v === category && s.chipActive]}
              >
                <Text
                  style={[s.chipText, v === category && { color: c.white }]}
                >
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>
          <Field
            label="Что случилось?"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={1500}
            placeholder="Например: в комнате не работает розетка у окна…"
          />
          <Text style={s.date}>{description.length}/1500 символов</Text>
          {error && <Notice error>{error}</Notice>}
          <Button disabled={busy} onPress={save} icon="check">
            {busy ? "Сохраняем…" : "Сохранить заявку"}
          </Button>
          <Text style={s.helper}>
            Сохраним черновик на устройстве. Это ещё не отправка сотруднику.
          </Text>
        </Sheet>
      )}
      {deleting && (
        <Sheet
          title="Удалить черновик?"
          onClose={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <Text style={s.description}>
            Восстановить эту заявку после удаления не получится.
          </Text>
          {error && <Notice error>{error}</Notice>}
          <Button
            disabled={busy}
            onPress={async () => {
              setBusy(true);
              try {
                await commit((d) => ({
                  ...d,
                  requests: d.requests.filter((r) => r.id !== deleting),
                }));
                setDeleting(null);
                setNotice("Черновик удалён.");
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
            icon="trash-2"
          >
            {busy ? "Удаляем…" : "Удалить черновик"}
          </Button>
        </Sheet>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 24,
  },
  count: { color: c.ink, fontSize: 20, fontWeight: "700" },
  badge: { color: c.purple },
  list: {
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 20,
    marginBottom: 22,
    overflow: "hidden",
  },
  request: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
    gap: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  category: { flexDirection: "row", gap: 9, alignItems: "center" },
  categoryText: { color: c.ink, fontWeight: "700" },
  status: {
    color: c.purple,
    backgroundColor: c.lavender,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 20,
    fontSize: 11,
  },
  description: { fontSize: 15, lineHeight: 24, color: c.ink },
  date: { fontSize: 12, color: c.muted },
  delete: { flexDirection: "row", alignItems: "center", gap: 6, padding: 7 },
  deleteText: { color: c.muted, fontSize: 12 },
  label: { fontSize: 13, fontWeight: "600", color: c.ink },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  chipActive: { backgroundColor: c.ink, borderColor: c.ink },
  chipText: { color: c.ink, fontSize: 13 },
  helper: { fontSize: 12, color: c.muted, lineHeight: 19 },
});
