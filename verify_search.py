from playwright.sync_api import sync_playwright, Page, expect

def verify_search_functionality(page: Page):
    """
    This test verifies that a user can search for a product
    from the home page and see the search results.
    """
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000")

    # 2. Act: Find the search bar, type a query, and submit.
    search_bar = page.get_by_placeholder("Search for shoes...")
    expect(search_bar).to_be_visible()
    search_bar.fill("nike")
    search_bar.press("Enter")

    # 3. Assert: Confirm the navigation to the search results page.
    # We expect the page URL to contain the search query.
    expect(page).to_have_url(
        "http://localhost:3000/search?q=nike", timeout=10000
    )
    # And a heading with the search query to be visible.
    results_heading = page.get_by_role(
        "heading", name='Search Results for "nike"'
    )
    expect(results_heading).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_search_functionality(page)
        browser.close()

if __name__ == "__main__":
    main()
