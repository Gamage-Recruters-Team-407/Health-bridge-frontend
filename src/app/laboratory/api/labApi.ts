// import { LabTest, LabSample, LabResult, TestStatus } from "../types";
//
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api/lab";
//
// async function handleResponse<T>(res: Response): Promise<T> {
//     if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
//     }
//     return res.json();
// }
//
// export async function createTestOrder(data: Partial<LabTest>): Promise<LabTest> {
//     const res = await fetch(`${BASE_URL}/test-orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     });
//     return handleResponse<LabTest>(res);
// }
//
// export async function getAllTestOrders(): Promise<LabTest[]> {
//     const res = await fetch(`${BASE_URL}/test-orders`, { cache: "no-store" });
//     return handleResponse<LabTest[]>(res);
// }
//
// export async function getTestOrdersByStatus(status: TestStatus): Promise<LabTest[]> {
//     const res = await fetch(`${BASE_URL}/test-orders/status/${status}`, { cache: "no-store" });
//     return handleResponse<LabTest[]>(res);
// }
//
// export async function getTestOrdersByPatient(patientId: string): Promise<LabTest[]> {
//     const res = await fetch(`${BASE_URL}/test-orders/patient/${patientId}`, { cache: "no-store" });
//     return handleResponse<LabTest[]>(res);
// }
//
// export async function collectSample(data: Partial<LabSample>): Promise<LabSample> {
//     const res = await fetch(`${BASE_URL}/samples/collect`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     });
//     return handleResponse<LabSample>(res);
// }
//
// export async function receiveSampleByBarcode(barcodeId: string): Promise<LabSample> {
//     const res = await fetch(`${BASE_URL}/samples/receive/${barcodeId}`, { method: "PUT" });
//     return handleResponse<LabSample>(res);
// }
//
// export async function saveResult(data: Partial<LabResult>): Promise<LabResult> {
//     const res = await fetch(`${BASE_URL}/results`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     });
//     return handleResponse<LabResult>(res);
// }
//
// export async function publishResult(resultId: string): Promise<LabResult> {
//     const res = await fetch(`${BASE_URL}/results/${resultId}/publish`, { method: "PUT" });
//     return handleResponse<LabResult>(res);
// }
//
// export async function getPatientHistory(patientId: string): Promise<LabResult[]> {
//     const res = await fetch(`${BASE_URL}/results/patient/${patientId}/history`, { cache: "no-store" });
//     return handleResponse<LabResult[]>(res);
// }

import { LabTest, LabSample, LabResult, TestStatus } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api/lab";

function authHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
}

export async function createTestOrder(data: Partial<LabTest>): Promise<LabTest> {
    const res = await fetch(`${BASE_URL}/test-orders`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse<LabTest>(res);
}

export async function getAllTestOrders(): Promise<LabTest[]> {
    const res = await fetch(`${BASE_URL}/test-orders`, {
        headers: authHeaders(),
        cache: "no-store",
    });
    return handleResponse<LabTest[]>(res);
}

export async function getTestOrdersByStatus(status: TestStatus): Promise<LabTest[]> {
    const res = await fetch(`${BASE_URL}/test-orders/status/${status}`, {
        headers: authHeaders(),
        cache: "no-store",
    });
    return handleResponse<LabTest[]>(res);
}

export async function collectSample(data: Partial<LabSample>): Promise<LabSample> {
    const res = await fetch(`${BASE_URL}/samples/collect`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse<LabSample>(res);
}

export async function receiveSampleByBarcode(barcodeId: string): Promise<LabSample> {
    const res = await fetch(`${BASE_URL}/samples/receive/${barcodeId}`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return handleResponse<LabSample>(res);
}

export async function saveResult(data: Partial<LabResult>): Promise<LabResult> {
    const res = await fetch(`${BASE_URL}/results`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse<LabResult>(res);
}

export async function publishResult(resultId: string): Promise<LabResult> {
    const res = await fetch(`${BASE_URL}/results/${resultId}/publish`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return handleResponse<LabResult>(res);
}

export async function getPatientHistory(patientId: string): Promise<LabResult[]> {
    const res = await fetch(`${BASE_URL}/results/patient/${patientId}/history`, {
        headers: authHeaders(),
        cache: "no-store",
    });
    return handleResponse<LabResult[]>(res);
}