import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods to avoid noise in tests
const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

// Import rateLimit to reset state between tests
import { resetRateLimit } from "@/lib/rateLimit";

describe("Contact Proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset rate limiting state
    resetRateLimit();
  });

  afterEach(() => {
    // Reset environment variables after each test
    delete process.env.CONTACT_API_URL;
    delete process.env.CONTACT_SHARED_SECRET;
    vi.restoreAllMocks();
  });

  const createMockRequest = (data: any, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });
  };

  const createMockRequestWithIP = (data: any, ip: string, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
        ...headers,
      },
      body: JSON.stringify(data),
    });
  };

  // Create valid test data with future date and business hours
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  const validContactData = {
    name: "John Doe",
    company: "Test Company",
    phone: "555-123-4567",
    email: "john@example.com",
    jobAddress: "123 Main St",
    municipality: "Philadelphia",
    inspectionType: "Rough",
    preferredDate: tomorrowString,
    preferredTime: "10:00",
    notes: "Test notes",
  };

  it("should validate input and reject invalid data", async () => {
    const invalidData = {
      name: "", // Invalid: too short
      email: "invalid-email", // Invalid email format
      // Missing required fields
    };

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Validation failed");
    expect(result.details).toBeDefined();
  });

  it("should reject honeypot submissions", async () => {
    const honeypotData = {
      ...validContactData,
      _hp: "bot-detected",
    };

    const request = createMockRequest(honeypotData);
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.ok).toBe(true);
    // Should not call upstream API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should enforce rate limiting", async () => {
    // Make multiple requests from the same IP to trigger rate limiting
    const requests = Array.from({ length: 6 }, () => createMockRequest(validContactData));
    
    // First 5 requests should succeed
    for (let i = 0; i < 5; i++) {
      const response = await POST(requests[i]);
      expect(response.status).toBe(200);
    }
    
    // 6th request should be rate limited
    const response = await POST(requests[5]);
    const result = await response.json();
    
    expect(response.status).toBe(429);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("rate_limited");
  });

  it("should return dev mode when CONTACT_API_URL is not set", async () => {
    const request = createMockRequestWithIP(validContactData, "192.168.1.1");
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.dev).toBe(true);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "[DEV CONTACT] would forward:",
      expect.objectContaining({
        ip: "192.168.1.1",
        data: expect.objectContaining(validContactData),
      })
    );
  });

  it("should forward sanitized payload to upstream API", async () => {
    process.env.CONTACT_API_URL = "https://api.example.com/contact";
    process.env.CONTACT_SHARED_SECRET = "test-secret";

    // Mock successful upstream response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const request = createMockRequestWithIP(validContactData, "192.168.1.2");
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.ok).toBe(true);

    // Verify fetch was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/contact",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-empire-signature": expect.any(String),
        }),
        body: expect.stringContaining('"name":"John Doe"'),
        cache: "no-store",
      })
    );

    // Verify forwarded payload contains only whitelisted fields
    const callArgs = mockFetch.mock.calls[0];
    const forwardedData = JSON.parse(callArgs[1].body);
    expect(forwardedData).toEqual({
      name: "John Doe",
      company: "Test Company",
      email: "john@example.com",
      phone: "555-123-4567",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredDate: tomorrowString,
      preferredTime: "10:00",
      preferredDateTime: null,
      notes: "Test notes",
    });
  });

  it("should handle upstream API errors", async () => {
    process.env.CONTACT_API_URL = "https://api.example.com/contact";

    // Mock upstream error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const request = createMockRequestWithIP(validContactData, "192.168.1.3");
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(502);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Upstream error");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Upstream contact error:",
      500,
      "Internal Server Error"
    );
  });

  it("should handle upstream API network errors", async () => {
    process.env.CONTACT_API_URL = "https://api.example.com/contact";

    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request = createMockRequestWithIP(validContactData, "192.168.1.4");
    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Internal server error");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Contact proxy error:",
      expect.any(Error)
    );
  });

  it("should not include signature header when CONTACT_SHARED_SECRET is not set", async () => {
    process.env.CONTACT_API_URL = "https://api.example.com/contact";
    // CONTACT_SHARED_SECRET is not set

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const request = createMockRequestWithIP(validContactData, "192.168.1.5");
    const response = await POST(request);

    expect(response.status).toBe(200);

    // Verify no signature header was included
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers).not.toHaveProperty("x-empire-signature");
  });

  it("should handle malformed JSON in request", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "invalid json",
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Validation failed");
  });
});
