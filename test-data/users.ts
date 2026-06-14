/**
 * Test data for the SauceDemo suite. Credentials and form inputs live here so
 * the specs read as behaviour, not literals.
 */

export type Credentials = {
  username: string;
  password: string;
};

export const users = {
  /** A normal account that can browse, add to cart and check out. */
  standard: { username: "standard_user", password: "secret_sauce" },
  /** An account the app refuses to log in. */
  locked: { username: "locked_out_user", password: "secret_sauce" },
} satisfies Record<string, Credentials>;

/** Stable product ids used in the SauceDemo data-test attributes. */
export const products = {
  backpack: "sauce-labs-backpack",
  bikeLight: "sauce-labs-bike-light",
  boltShirt: "sauce-labs-bolt-t-shirt",
};

/** Throwaway shipping details for the checkout form. */
export const checkoutInfo = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "12345",
};
