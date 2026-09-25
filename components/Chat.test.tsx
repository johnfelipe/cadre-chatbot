import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText } from "@/components/Chat";

const render = (text: string) => renderToStaticMarkup(<RichText text={text} />);

describe("RichText", () => {
  it("escapes HTML instead of rendering it", () => {
    const html = render('<script>alert(1)</script><img src=x onerror="alert(2)">');
    expect(html).not.toMatch(/<script|<img/);
    expect(html).toContain("&lt;script&gt;");
  });

  it("links only http(s) URLs, never javascript:", () => {
    const html = render("Go to https://cadreai.com/contact or javascript:alert(3)");
    expect(html).toContain('href="https://cadreai.com/contact"');
    expect(html).not.toMatch(/href="javascript:/);
  });

  it("keeps trailing punctuation and em dashes out of the link", () => {
    expect(render("See https://cadreai.com/contact.")).toContain('href="https://cadreai.com/contact"');
    expect(render("Try https://portal.gocadre.ai/ai-maturity-index—it's free")).toContain(
      'href="https://portal.gocadre.ai/ai-maturity-index"',
    );
  });

  it("opens links in a new tab without leaking the opener", () => {
    expect(render("https://cadreai.com")).toMatch(/target="_blank" rel="noopener noreferrer"/);
  });

  it("renders **bold** as strong, with links still working inside it", () => {
    const html = render("**Email:** hello@gocadre.ai and **https://cadreai.com/contact**");
    expect(html).toContain("<strong>Email:</strong>");
    expect(html).toContain('<strong><a href="https://cadreai.com/contact"');
  });
});
