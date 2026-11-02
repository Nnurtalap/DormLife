import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Profile = { name: string; room: string; email: string };
export type Request = {
  id: string;
  category: string;
  description: string;
  createdAt: string;
};
export type Booking = {
  id: string;
  resource: string;
  date: string;
  hour: number;
};
type Data = { profile: Profile; requests: Request[]; bookings: Booking[] };
type Action = (data: Data) => Data;
type Store = Data & {
  ready: boolean;
  error: string;
  commit: (action: Action) => Promise<void>;
};
const initial: Data = {
  profile: { name: "", room: "", email: "" },
  requests: [],
  bookings: [],
};
const KEY = "dormlife.resident.v1";
const Context = createContext<Store | null>(null);

function validData(value: unknown): value is Data {
  if (!value || typeof value !== "object") return false;
  const d = value as Data;
  return (
    !!d.profile &&
    ["name", "room", "email"].every(
      (k) => typeof d.profile[k as keyof Profile] === "string",
    ) &&
    Array.isArray(d.requests) &&
    d.requests.every(
      (r) =>
        typeof r.id === "string" &&
        typeof r.category === "string" &&
        typeof r.description === "string" &&
        !Number.isNaN(Date.parse(r.createdAt)),
    ) &&
    Array.isArray(d.bookings) &&
    d.bookings.every(
      (b) =>
        typeof b.id === "string" &&
        typeof b.resource === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
        Number.isInteger(b.hour) &&
        b.hour >= 8 &&
        b.hour <= 21,
    )
  );
}

export function ResidentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(data);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (!validData(parsed)) throw new Error("invalid data");
          current.current = parsed;
          setData(parsed);
        }
        setReady(true);
      })
      .catch(() => {
        if (mounted)
          setError(
            "Не удалось прочитать сохранённые данные. Проверьте доступ к хранилищу и перезапустите приложение. Данные не перезаписаны.",
          );
      });
    return () => {
      mounted = false;
    };
  }, []);

  const commit = (action: Action) => {
    if (!ready) return Promise.reject(new Error("Хранилище ещё не готово."));
    const operation = queue.current.then(async () => {
      const next = action(current.current);
      try {
        await AsyncStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        throw new Error(
          "Не удалось сохранить данные. Проверьте свободное место и разрешения браузера.",
        );
      }
      current.current = next;
      setData(next);
    });
    queue.current = operation.catch(() => {});
    return operation;
  };
  return (
    <Context.Provider value={{ ...data, ready, error, commit }}>
      {children}
    </Context.Provider>
  );
}

export function useResident() {
  const store = useContext(Context);
  if (!store) throw new Error("ResidentProvider is missing");
  return store;
}
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function bookingTime(booking: Pick<Booking, "date" | "hour">) {
  return new Date(
    `${booking.date}T${String(booking.hour).padStart(2, "0")}:00:00`,
  ).getTime();
}
export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
