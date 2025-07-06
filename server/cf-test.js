import puppeteer from "puppeteer";

const scrape = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://codeforces.com/profile/tourist", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const content = await page.content(); // get full HTML
    console.log(content); // 🔍 print the HTML to inspect

    await browser.close();
  } catch (err) {
    console.error("❌ Puppeteer error:", err);
  }
};

scrape();
