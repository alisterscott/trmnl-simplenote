import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("can see all the views for a simplenote doc with quotes", async ({
  page,
}) => {
  const sourceFile = path.join(__dirname, "quotes.trmnlp.yml");
  const destFile = path.join(__dirname, "..", ".trmnlp.yml");

  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file not found: ${sourceFile}`);
  }

  if (!fs.existsSync(destFile)) {
    throw new Error(`Destination file not found: ${destFile}`);
  }

  const originalContent = fs.readFileSync(destFile, "utf-8"); // Save original content to restore later

  fs.copyFileSync(sourceFile, destFile);

  try {
    const routes = ["/quadrant", "/full", "/half_vertical", "/half_horizontal"];

    for (const route of routes) {
      await test.step(`Testing route: ${route}`, async () => {
        await page.goto(route);
        await page.getByRole("link", { name: "Poll" }).click();
        const trmnlFrame = page.frameLocator("iframe");
        await expect(
          trmnlFrame.locator("div.simplenotestart span.title").first(),
        ).toContainText("My Favourite Quotes Today");
      });
    }
  } finally {
    fs.writeFileSync(destFile, originalContent, "utf-8"); // Restore original content
  }
});
