import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

export async function POST(request: Request) {
  try {
    // Parse request body
    const { siteUrl, email, password, workflowUrl } = await request.json();

    if (!siteUrl || !email || !password || !workflowUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
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
    console.log("enter");
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 4,
    });
    console.log("going in");
    await page.goto(siteUrl, { waitUntil: "networkidle2" });
    console.log("looking for the elements");
    // Wait for the email input field and type the email
    await page.waitForSelector('input[name="emailOrLdapLoginId"]');
    await page.type('input[name="emailOrLdapLoginId"]', email);
    console.log("email");
    // Wait for the password input field and type the password
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', password);
    console.log("password");
    // Optionally, click the login button if needed
    await page.click(
      "#content > div > div > div > div._formContainer_1vfzm_141 > div > div._buttonsContainer_g8hr0_146._actionContainer_g8hr0_141 > button"
    );
    console.log("clicked");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    await page.goto(workflowUrl, {
      waitUntil: "networkidle2",
    });
    await new Promise((r) => setTimeout(r, 10000));
    console.log("workflow page");
    const pageTitle = await page.content();

    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();

    return Response.json({
      pageTitle,
      screenshot: `data:image/png;base64,${screenshot}`,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in scraper:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
