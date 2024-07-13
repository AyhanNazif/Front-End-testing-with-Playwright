const {test, expect} = require("@playwright/test");

test("Verify All Books link is visible", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");

    const AllBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await AllBooksLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify Login link is visible", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");

    const LoginLink = await page.$('a[href="/login"]');
    const isLinkVisible = await LoginLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify Register link is visible", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");

    const RegisterLink = await page.$('a[href="/register"]');
    const isLinkVisible = await RegisterLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify All Books link is visible, when user is logged in", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');

    const AllBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await AllBooksLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify My Books link is visible, when user is logged in", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');

    const MyBooksLink = await page.$('a[href="/profile"]');
    const isLinkVisible = await MyBooksLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify Add Books link is visible, when user is logged in", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');

    const AddBookLink = await page.$('a[href="/create"]');
    const isLinkVisible = await AddBookLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify Logout link is visible, when user is logged in", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');

    const LogoutLink = await page.$('#logoutBtn');
    const isLinkVisible = await LogoutLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test("Verify email address is visible, when user is logged in", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');

    const emailAddress = await page.textContent("#user span");
    expect(emailAddress).toContain("peter@abv.bg");
});

test("Verify Login page with valid data", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");

    expect(page.url()).toBe("http://localhost:3000/catalog");
});

test("Verify Login page with empty data", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog => {

        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain("All fields are required!");
        await dialog.accept();
    });

    expect(page.url()).toBe("http://localhost:3000/login");
});

test("Verify Register page, with valid data", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/register"]');
    await page.fill("#email","ayhanlutfi@abv.bg");
    await page.fill("#password", "ayhan");
    await page.fill("#repeat-pass", "ayhan");
    await page.click('input[type="submit"]');

    const getCurrentNav = await page.$eval("#user", nav => nav.style.display = "");

    expect(getCurrentNav).not.toBeNull();
    expect(page.url()).toBe("http://localhost:3000/catalog");
});

test("Verify Register page, with empty data", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/register"]');
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog => {
        expect(dialog.type().toContain("alert"));
        expect(dialog.message().toContain("All Fields are required!"));
        await dialog.accept();
    })

    expect(page.url()).toBe("http://localhost:3000/register");
});

test("Verify Register page, when passwords don't match", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/register"]');
    await page.fill("#email","ayhanlutfi@abv.bg");
    await page.fill("#password", "ayhan");
    await page.fill("#repeat-pass", "a");
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog => {
        expect(dialog.type().toContain("alert"));
        expect(dialog.message().toContain("Passwords don't match!"));
        await dialog.accept();
    })

    expect(page.url()).toBe("http://localhost:3000/register");
});

test("Verify My Books, with no added books from Creator", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","ayhanlutfi@abv.bg");
    await page.fill("#password","ayhan");
    await page.click('input[type="submit"]'); 
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click('a[href="/profile"]');

    const myBooks = await page.textContent("p.no-books");

    expect(myBooks).toBe("No books in database!");
});

test("Add book with correct data", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","peter@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');

    await page.waitForURL("http://localhost:3000/catalog");
    await page.click('a[href="/create"]');
    await page.waitForSelector("#create-form");

    await page.fill("#title","Some title");
    await page.fill("#description", "Some description");
    await page.fill("#image", "abv");
    await page.selectOption("#type", "Romance");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");

    expect(page.url()).toBe("http://localhost:3000/catalog");
});

test("Add book with empty fields", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","peter@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');

    await page.waitForURL("http://localhost:3000/catalog");
    await page.click('a[href="/create"]');
    await page.waitForSelector("#create-form");

    await page.selectOption("#type", "Romance");
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog =>{
        expect(dialog.type().toContain("alert"));
        expect(dialog.message().toContain("All fields are required!"));
        await dialog.accept();
    });

    expect(page.url()).toBe("http://localhost:3000/create");
});

test("Verify All Books page", async ({page}) => {

    await page.goto("localhost:3000/");
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/catalog"]');

    await page.waitForURL("http://localhost:3000/catalog");
    const allBooks = await page.$$(".otherBooks");

    expect(allBooks.length).toBeGreaterThan(0);
});

test("Logged user/Creator of book should see all elements of the book, Edit button, Delete button and total Likes label", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","peter@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click(".otherBooks a.button");

    const title = await page.textContent(".book-information h3");
    const type = await page.textContent(".type");
    const description = await page.textContent(".book-description p");
    const EditDeleteButton = await page.$eval('.actions', button => button.textContent);
    const heartIcon = await page.$(".likes img.hearts");
    const LikesLabel = await page.$(".likes #total-likes");

    expect(EditDeleteButton).toContain("Edit");
    expect(EditDeleteButton).toContain("Delete");
    expect(title).toBe("Some title");
    expect(type).toBe("Type: Romance");
    expect(description).toBe('Some description');
    expect(heartIcon).not.toBeNull();
    expect(LikesLabel).not.toBeNull();
});

test("Logged user/Non-Creator should see all elements of the book, Like button and total Likes label", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click(".otherBooks a.button");

    const title = await page.textContent(".book-information h3");
    const type = await page.textContent(".type");
    const description = await page.textContent(".book-description p");

    const LikeButton = await page.$('.actions a[href="javascript:void(0)"]');
    const isLikeButtonVisible = await LikeButton.isVisible();

    const heartIcon = await page.$(".likes img.hearts");
    const LikesLabel = await page.$(".likes #total-likes");

    expect(isLikeButtonVisible).toBe(true);
    expect(title).toBe("Some title");
    expect(type).toBe("Type: Romance");
    expect(description).toBe('Some description');
    expect(heartIcon).not.toBeNull();
    expect(LikesLabel).not.toBeNull();
});

test("Logged user/Non-Creator verify Like button is working correctly", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click(".otherBooks a.button");
    await page.click('.actions a[href="javascript:void(0)"]');

    const LikeButton = await page.$('.actions a.button');
    const CountLike = await page.textContent('.likes #total-likes');

    expect(LikeButton).toBeNull();
    expect(CountLike).toBe("Likes: 1");
});

test("Non logged user should see all elements of the book and total Likes label", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click(".otherBooks a.button");

    const title = await page.textContent(".book-information h3");
    const type = await page.textContent(".type");
    const description = await page.textContent(".book-description p");
    const heartIcon = await page.$(".likes img.hearts");
    const LikesLabel = await page.$(".likes #total-likes");

    expect(title).toBe("Some title");
    expect(type).toBe("Type: Romance");
    expect(description).toBe('Some description');
    expect(heartIcon).not.toBeNull();
    expect(LikesLabel).not.toBeNull();
});

test("Verify Logout button is visible", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForSelector("nav.navbar");

    const logoutButton = await page.$('#user #logoutBtn');
    const isLogoutButtonVisible = await logoutButton.isVisible();

    expect(isLogoutButtonVisible).toBe(true);
});

test("Verify Logout button is working correctly", async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]');
    await page.waitForSelector("nav.navbar");
    await page.click("#user #logoutBtn");

    const currentNavigation = await page.$eval("#user", nav => nav.style.display = "none");

    expect(currentNavigation).not.toBeNull();
    expect(page.url()).toBe("http://localhost:3000/");
});

test("Verify My Books link is working correctly",async({page}) => {

    await page.goto("localhost:3000/");
    await page.click('a[href="/login"]');
    await page.fill("#email","john@abv.bg");
    await page.fill("#password","123456");
    await page.click('input[type="submit"]'); 
    await page.waitForURL("http://localhost:3000/catalog");
    await page.click('a[href="/profile"]'); 
    await page.waitForURL("http://localhost:3000/profile");

    const CountBooks = await page.$$(".otherBooks");

    expect(CountBooks.length).toBeGreaterThan(0);
});