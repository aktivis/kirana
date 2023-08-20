import { test, expect, Page } from "@playwright/test";

test.describe("Feature: Research", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("http://localhost:3000/");
    await expect(page).toHaveTitle("Kirana");
  });

  test("GET all researches", async () => {
    await expect(page.locator(".awsui_header_5gtk3_18yfo_105")).toHaveText(
      "Kirana Desktop"
    );
    await expect(page.locator(".awsui_content_14iqq_1t1om_189")).toHaveText(
      "No research projects found, please start a new one."
    );
  });

  test("POST a new research", async () => {
    await page.getByRole("button", { name: "Start a new project" }).click();
    await page.getByLabel("Name").click();
    await page.getByLabel("Name").fill('Project "Kirana"');
    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("This is our research.");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.locator(".awsui_flash_1q84n_1qhy5_93")).toHaveText(
      "Project created successfully."
    );
    await expect(page.getByRole("link")).toHaveText('Project "Kirana"');
  });

  test("PUT properties of a research", async () => {
    await page
      .locator(".awsui_button-dropdown_sne0l_1etr6_93")
      .getByRole("button")
      .click();
    await page.getByRole("menuitem", { name: "Modify" }).click();
    await page.getByLabel("Name").click();
    await page.getByLabel("Name").fill('Project "Kirana" NEW');
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.locator(".awsui_flash_1q84n_1qhy5_93")).toHaveText(
      "Project updated successfully."
    );
    await expect(page.getByRole("link")).toHaveText('Project "Kirana" NEW');
  });

  test("DELETE an existing research", async () => {
    await page
      .locator(".awsui_button-dropdown_sne0l_1etr6_93")
      .getByRole("button")
      .click();
    await page.getByRole("menuitem", { name: "Remove" }).click();
    await expect(page.locator(".awsui_alert_mx3cw_1sjtq_93")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.locator(".awsui_flash_1q84n_1qhy5_93")).toHaveText(
      "Project deleted successfully."
    );
    await expect(page.locator(".awsui_content_14iqq_1t1om_189")).toHaveText(
      "No research projects found, please start a new one."
    );
  });

  test.afterAll(async () => {
    await page.close();
  });
});
