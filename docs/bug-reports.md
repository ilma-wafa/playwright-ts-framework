# Defect Reports — SauceDemo

Defects found using the `problem_user` account. Reproduced via the automated `bug-hunt` suite in this repository (`tests/ui/bug-hunt.spec.ts`), run with `npx playwright test --project=bug-hunt`.

Environment: Chromium 151, Windows 11, https://www.saucedemo.com
Reported: 3 September 2026

---

## BUG-01 — All product images render from a single source

**Severity:** Medium
**Priority:** Medium
**Component:** Inventory page

**Summary**
All six products on the inventory page display the same image instead of their individual product photographs.

**Steps to reproduce**
1. Navigate to https://www.saucedemo.com
2. Log in as `problem_user` / `secret_sauce`
3. Observe the six product tiles on the inventory page

**Expected result**
Each product displays its own distinct image, giving six unique image sources.

**Actual result**
All six `<img>` elements resolve to the same source. Collecting the `src` attribute of every product image and counting unique values returns 1 where 6 is expected.

**Evidence**

```
Expected: 6
Received: 1
  at tests/ui/bug-hunt.spec.ts:11
```

**Impact**
Customers cannot visually distinguish products, which undermines product selection and is likely to increase incorrect orders and returns. Not blocking, as the purchase flow still completes.

---

## BUG-02 — Last name field on checkout silently rejects input

**Severity:** High
**Priority:** High
**Component:** Checkout — customer information (step one)

**Summary**
The Last Name field on the checkout information form does not accept typed input. Characters entered do not appear and the field's value remains empty.

**Steps to reproduce**
1. Navigate to https://www.saucedemo.com
2. Log in as `problem_user` / `secret_sauce`
3. Add any product to the cart
4. Open the cart and select Checkout
5. Type any text into the Last Name field

**Expected result**
The field accepts and displays the entered text; its value matches the input.

**Actual result**
The field remains empty. The DOM shows `value=""` after input, and the element carries the class `input_error`.

**Evidence**

```
Expected: "Wafa"
Received: ""
locator resolved to <input value="" type="text" id="last-name"
  name="lastName" data-test="lastName" class="input_error form_input"/>
  at tests/ui/bug-hunt.spec.ts:23
```

**Impact**
Blocks purchase completion entirely. See "Observed impact" below.

**Observed impact — checkout cannot proceed past step one**
Because the field cannot be populated, submitting the form with otherwise valid information leaves the user on `checkout-step-one.html` rather than advancing to `checkout-step-two.html`. This is a downstream effect of BUG-02, not a separate defect, and is expected to resolve once the input issue is fixed. Retest the full purchase flow after the fix to confirm.

Evidence:

```
Expected pattern: /checkout-step-two.html/
Received string:  "https://www.saucedemo.com/checkout-step-one.html"
  at tests/ui/bug-hunt.spec.ts:36
```

---

## Notes on scope

`problem_user` is one of several accounts SauceDemo provides with deliberately seeded defects, intended as a target for exploratory and automated testing. These reports document what the automated suite detected and are written as they would be filed against a real application.

The `bug-hunt` suite is isolated in its own Playwright project and excluded from the default test run, so its intentional failures do not affect the CI status of the main suite.