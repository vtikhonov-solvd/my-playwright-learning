const retries: number = "five";  // What does VS Code show? const retries = "five"; or const retries: number = "5;
const user = { email: "john@test.com" };
console.log(user.password);      // What does VS Code show? password is not set on user, so it should show an error or undefined

function getTimeout(seconds: number): string { //function getTimeout(seconds: number): number
  return seconds * 1000;  // Hint: look at the return type 
}

const config = { baseURL: "https://staging.example.com" }; 
console.log(config.baseUrl);  // Hint: case matters  console.log(config.baseURL);

function printName(name?: string) { 
if (!name) return;
  console.log(name);
}
const userName: string | undefined = undefined;
printName(userName);  // Hint: what if userName is undefined?



type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const productA: Product = {
  name: "Coffee Mug",
  price: 9.99,
  inStock: true,
};

const productB: Product = {
  name: "Notebook",
  price: 4.5,
  inStock: false,
};

function formatPrice(price: number): string {
  return `$${price}`;
}

console.log(formatPrice(productA.price));
console.log(formatPrice(productB.price));
