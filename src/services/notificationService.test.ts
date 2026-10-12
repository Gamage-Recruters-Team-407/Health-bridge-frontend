import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ getToken: () => "test-token" }));
import { getNotifications } from "./notificationService";
afterEach(() => { vi.unstubAllGlobals(); });

describe("notification polling", () => {
  it("shares an in-flight request and permits a fresh request after it finishes", async () => {
    let resolve!: (response: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>(done => { resolve = done; }));
    vi.stubGlobal("fetch", fetchMock);
    const first = getNotifications();
    const second = getNotifications();
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledOnce();
    resolve(Response.json([]));
    await first;
    const third = getNotifications();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    resolve(Response.json([]));
    await third;
  });
});
