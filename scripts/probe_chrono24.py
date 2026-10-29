import json
import re
from playwright.sync_api import sync_playwright

def probe():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            locale="en-US"
        )
        page = context.new_page()
        url = "https://www.chrono24.com/rolex/ref-126610ln.htm"
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=25000)
        
        # Check structured JSON-LD data
        json_lds = page.evaluate("""() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            return Array.from(scripts).map(s => s.innerText);
        }""")
        print(f"Found {len(json_lds)} application/ld+json blocks.")
        for idx, s in enumerate(json_lds):
            try:
                data = json.loads(s)
                print(f"Block {idx} keys/type: {type(data)}: {list(data.keys()) if isinstance(data, dict) else len(data)}")
                if isinstance(data, dict) and data.get("@type") == "Product":
                    print("--> Found Product Schema:")
                    print("Name:", data.get("name"))
                    print("Offers:", data.get("offers"))
            except Exception as e:
                pass
                
        # Inspect listing cards around wt-listing-item-price
        cards_info = page.evaluate("""() => {
            const priceEls = document.querySelectorAll('.wt-listing-item-price, [class*="listing-item-price"]');
            const data = [];
            for (let p of priceEls) {
                // Find parent container
                let card = p.closest('article, .wt-listing-card, div.js-article-item, a, div[class*="listing"]');
                if (!card) card = p.parentElement?.parentElement;
                
                const priceText = p.innerText.trim();
                const fullText = card ? card.innerText.replace(/\\s+/g, ' ').trim() : '';
                const link = card ? (card.getAttribute('href') || card.querySelector('a')?.getAttribute('href') || '') : '';
                
                // Identify seller info & badges
                const isDealer = /Professional|Dealer|Verified/i.test(fullText);
                const isPrivate = /Private/i.test(fullText);
                
                data.push({
                    price: priceText,
                    fullSnippet: fullText.slice(0, 250),
                    link: link,
                    isDealer: isDealer,
                    isPrivate: isPrivate
                });
            }
            return data;
        }""")
        
        print(f"Extracted {len(cards_info)} cards!")
        for c in cards_info[:5]:
            print("--- Card ---")
            print("Price:", c["price"])
            print("Dealer:", c["isDealer"], "| Private:", c["isPrivate"])
            print("Snippet:", c["fullSnippet"])
            print("Link:", c["link"])

            
        browser.close()

if __name__ == "__main__":
    probe()
