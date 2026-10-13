import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./[...path]/route";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
const context = { params: Promise.resolve({ path: ["doctor-sessions", "mine"] }) };

describe("API forwarding", () => {
  it("preserves authentication, query parameters, and backend error status", async () => {
    vi.stubEnv("BACKEND_API_URL", "http://127.0.0.1:8088/api");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ message: "Forbidden" }, { status: 403 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(new Request("http://localhost:3000/api/doctor-sessions/mine?page=1", { headers: { Authorization: "Bearer test-token" } }), context);
    expect(response.status).toBe(403);
    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:8088/api/doctor-sessions/mine?page=1");
    expect(fetchMock.mock.calls[0][1].headers.get("authorization")).toBe("Bearer test-token");
  });
  it("returns 503 when the backend resets the connection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    const response = await GET(new Request("http://localhost:3000/api/doctor-sessions/mine"), context);
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("5");
  });
  it("aborts a stalled backend request after 20 seconds", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener("abort", () => reject(new Error("Aborted")));
    })));
    const pending = GET(new Request("http://localhost:3000/api/doctor-sessions/mine"), context);
    await vi.advanceTimersByTimeAsync(20000);
    expect((await pending).status).toBe(503);
  });
  it("forwards POST bodies without retrying writes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    await POST(new Request("http://localhost:3000/api/auth/login", { method: "POST", body: '{"example":true}' }), context);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(new TextDecoder().decode(fetchMock.mock.calls[0][1].body)).toBe('{"example":true}');
  });
});
