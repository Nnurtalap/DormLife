import { expect, test } from "@playwright/test";

test("navigation, profile validation, and data survive a reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByText("Что сделаем сегодня?")).toBeVisible();
  await page.getByRole("link", { name: "Профиль", exact: true }).click();
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Введи имя");
  await page.getByLabel("Как тебя зовут?").fill("Айдана");
  await page.getByLabel("Номер комнаты").fill("304Б");
  await page.getByLabel("Электронная почта (необязательно)").fill("не почта");
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Проверь адрес");
  await page
    .getByLabel("Электронная почта (необязательно)")
    .fill("Aidana@example.kz");
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await expect(
    page.getByText("Профиль сохранён.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Как тебя зовут?")).toHaveValue("Айдана");
  await expect(
    page.getByLabel("Электронная почта (необязательно)"),
  ).toHaveValue("aidana@example.kz");
  await page.getByRole("link", { name: "Главная", exact: true }).click();
  await expect(
    page.getByText("Привет, Айдана!", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("request drafts validate, persist, and delete with confirmation", async ({
  page,
}) => {
  await page.goto("/requests");
  await page
    .getByRole("button", { name: "Создать заявку", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Сохранить заявку", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("минимум 10 символов");
  await page.getByRole("button", { name: "Электрика", exact: true }).click();
  await page
    .getByLabel("Что случилось?")
    .fill("В комнате не работает розетка у окна");
  await page
    .getByRole("button", { name: "Сохранить заявку", exact: true })
    .click();
  await expect(page.getByText("Черновик", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("В комнате не работает розетка у окна", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Удалить заявку: В комнате не работает розетка у окна",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Закрыть окно", exact: true }).click();
  await expect(
    page.getByText("В комнате не работает розетка у окна", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Удалить заявку: В комнате не работает розетка у окна",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Удалить черновик", exact: true })
    .click();
  await expect(
    page.getByText("Пока всё в порядке", { exact: true }),
  ).toBeVisible();
});

test("plans persist, overlapping hours are blocked, deletion releases the hour", async ({
  page,
}) => {
  await page.goto("/bookings");
  await page
    .getByRole("button", { name: "Выбрать: Прачечная", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Добавить в мои планы", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Выбери время");
  await page.getByRole("button", { name: "Машина 2", exact: true }).click();
  await page.getByRole("button", { name: "10:00", exact: true }).click();
  await page
    .getByRole("button", { name: "Добавить в мои планы", exact: true })
    .click();
  await expect(
    page.getByText("Стиральная машина №2", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Стиральная машина №2", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Выбрать: Учебная комната", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "10:00", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Закрыть окно", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Удалить план: Стиральная машина №2",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Удалить план", exact: true }).click();
  await page
    .getByRole("button", { name: "Выбрать: Учебная комната", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "10:00", exact: true }),
  ).toBeEnabled();
});

test("failed writes show an error without claiming the profile was saved", async ({
  page,
}) => {
  await page.goto("/profile");
  await page.getByLabel("Как тебя зовут?").fill("Айдана");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Не удалось сохранить данные",
  );
  await expect(
    page.getByText("Профиль сохранён.", { exact: false }),
  ).toHaveCount(0);
});

test("corrupt saved data is not silently overwritten", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Что сделаем сегодня?").waitFor();
  await page.evaluate(() =>
    localStorage.setItem("dormlife.resident.v1", "{invalid json"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Данные не перезаписаны");
  expect(
    await page.evaluate(() => localStorage.getItem("dormlife.resident.v1")),
  ).toBe("{invalid json");
});

test("every page fits a narrow viewport and home guides open", async ({
  page,
}) => {
  for (const path of ["/", "/requests", "/bookings", "/profile"]) {
    await page.goto(path);
    await expect(
      page.getByRole("link", { name: "Профиль", exact: true }),
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
  }
  await page.goto("/");
  await page.getByText("Маленькая комната.", { exact: false }).click();
  await expect(
    page.getByText("Начни с того, что делает пространство твоим:", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Закрыть окно", exact: true }).click();
});

test("tablet navigation remains separated from the page header", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await expect(page.getByText("Что сделаем сегодня?")).toBeVisible();
  const logo = await page.getByRole("link", { name: "DormLife — главная" }).boundingBox();
  const profile = await page.getByRole("link", { name: "Открыть мой профиль" }).boundingBox();
  expect(logo).not.toBeNull();
  expect(profile).not.toBeNull();
  expect(logo!.x + logo!.width).toBeLessThan(profile!.x);
  const nav = page.getByRole("link", { name: "Бронирование", exact: true });
  const bounds = await nav.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(820);
  await nav.click();
  await expect(page.getByRole("button", { name: "Выбрать: Прачечная", exact: true })).toBeVisible();
});
