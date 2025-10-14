import { sanitizeEmail, isValidEmail } from "../utils/emailValidator";

interface TestCase {
  input: string;
  expectedSanitized?: string;
  expectedValid: boolean;
  description: string;
}

describe("Email Validator Tests", () => {
  
  describe("sanitizeEmail()", () => {
    const sanitizeTests: TestCase[] = [
      {
        input: "  USER@Example.COM  ",
        expectedSanitized: "user@example.com",
        expectedValid: true,
        description: "Trims spaces and lowercases the email",
      },
      {
        input: "user!@example.com",
        expectedSanitized: "user@example.com",
        expectedValid: true,
        description: "Removes disallowed special characters",
      },
      {
        input: "user@exam!ple.com",
        expectedSanitized: "user@example.com",
        expectedValid: true,
        description: "Removes disallowed special characters in domain",
      },
    ];

    sanitizeTests.forEach(({ input, expectedSanitized, description }) => {
      it(`should sanitize email correctly: ${description}`, () => {
        // Arrange & Act
        const result = sanitizeEmail(input);
        // Assert
        expect(result).toBe(expectedSanitized);
      });
    });
  });


  describe("isValidEmail()", () => {
    const validationTests: TestCase[] = [
      { input: "user@example.com", expectedValid: true, description: "Standard email" },
      { input: "user.name+tag@example.co.uk", expectedValid: true, description: "Email with plus and subdomain" },
      { input: "u@e.io", expectedValid: true, description: "Minimal valid email" },
      { input: "userexample.com", expectedValid: false, description: "Missing @" },
      { input: "user@@example.com", expectedValid: false, description: "Double @" },
      { input: "@example.com", expectedValid: false, description: "Missing local part" },
      { input: "user@", expectedValid: false, description: "Missing domain part" },
      { input: "user@.example.com", expectedValid: false, description: "Domain starts with dot" },
      { input: "user@example.com.", expectedValid: false, description: "Domain ends with dot" },
      { input: "user..name@example.com", expectedValid: false, description: "Consecutive dots in local part" },
      { input: "user@example", expectedValid: false, description: "Missing TLD" },
      { input: "user@example.c", expectedValid: false, description: "TLD too short" },
      { input: "user@exam_ple.com", expectedValid: false, description: "Invalid underscore in domain" },
      { input: "user@ example.com", expectedValid: false, description: "Space in domain" },
      { input: " user@example.com ", expectedValid: true, description: "Whitespace is sanitized" },
      { input: "\"user name\"@example.com", expectedValid: false, description: "Quoted local part (unsupported)" },
      { input: "user@[192.168.0.1]", expectedValid: false, description: "IP literal domain (unsupported)" },
      {
        input: "a".repeat(310) + "@example.com",
        expectedValid: false,
        description: "Exceeds 320 character limit",
      },
    ];

    validationTests.forEach(({ input, expectedValid, description }) => {
      it(`should validate email correctly: ${description}`, () => {
        // Arrange
        const sanitized = sanitizeEmail(input);
        // Act
        const result = isValidEmail(sanitized);
        // Assert
        expect(result).toBe(expectedValid);
      });
    });
  });
});
