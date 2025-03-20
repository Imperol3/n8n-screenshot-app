import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

export async function POST() {
  // Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
  await chromium.font(
    "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
  );

  const isLocal = process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal
      ? puppeteer.defaultArgs()
      : [...chromium.args, "--hide-scrollbars", "--incognito"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://my-chromium-bucket-victor.s3.eu-north-1.amazonaws.com/chromium-v133.0.0-pack.tar"
      )),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto("https://n8n.victorkituku.dev");
  const pageTitle = await page.title();
  await browser.close();

  return Response.json({ Title: pageTitle });
}
