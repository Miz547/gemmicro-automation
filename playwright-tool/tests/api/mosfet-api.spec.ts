import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

const MOSFET_API_URL = "https://www.gemmicro.com.tw/zh-TW/api/mosfet";
const ALLOWED_FIELD_TYPES = new Set(["string", "number", "boolean", "null"]);

type MosfetRecord = Record<string, unknown>;

function normalizeRecords(payload: unknown): MosfetRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is MosfetRecord => item !== null && typeof item === "object" && !Array.isArray(item));
  }

  if (payload !== null && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data.filter((item): item is MosfetRecord => item !== null && typeof item === "object" && !Array.isArray(item));
    }
  }

  return [];
}

function valueType(value: unknown) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}

async function annotateApiCase(caseId: string, story: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("MOSFET API");
  await allure.story(story);
  await allure.severity("critical");
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro MOSFET API cases", () => {
  test("TC-007 @mosfet @api @schema @P0 MOSFET API field types are valid", async ({ request }, testInfo) => {
    await annotateApiCase(
      "TC-007",
      "API field type validation",
      "Verify every MOSFET API field value is a supported primitive JSON type."
    );

    const response = await request.get(MOSFET_API_URL);
    expect(response.ok()).toBeTruthy();

    const payload = await response.json();
    await testInfo.attach("raw-api-response.json", {
      body: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),
      contentType: "application/json"
    });

    const records = normalizeRecords(payload);
    expect(records.length, "MOSFET API should return at least one record").toBeGreaterThan(0);

    const anomalies = records.flatMap((record, index) =>
      Object.entries(record)
        .filter(([, value]) => !ALLOWED_FIELD_TYPES.has(valueType(value)))
        .map(([field, value]) => ({
          index,
          pn: String(record.pn ?? ""),
          field,
          detectedType: valueType(value),
          value
        }))
    );

    await testInfo.attach("field-type-anomalies.json", {
      body: Buffer.from(JSON.stringify(anomalies, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(anomalies, "All MOSFET API field values should be primitive JSON values").toEqual([]);
  });

  test("TC-011 @mosfet @api @data-quality @P0 MOSFET API duplicate record check by pn and pn+type", async ({ request }, testInfo) => {
    await annotateApiCase(
      "TC-011",
      "API duplicate data validation",
      "Verify pn duplicates are reported and pn + type composite duplicates fail the test."
    );

    const response = await request.get(MOSFET_API_URL);
    expect(response.ok()).toBeTruthy();

    const payload = await response.json();
    await testInfo.attach("raw-api-response.json", {
      body: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),
      contentType: "application/json"
    });

    const records = normalizeRecords(payload);
    expect(records.length, "MOSFET API should return at least one record").toBeGreaterThan(0);

    const pnMap = new Map<string, number[]>();
    const compositeMap = new Map<string, number[]>();

    records.forEach((record, index) => {
      const pn = String(record.pn ?? "").trim();
      const type = String(record.type ?? "").trim();

      if (!pn) {
        return;
      }

      pnMap.set(pn, [...(pnMap.get(pn) ?? []), index]);

      const key = `${pn}::${type}`;
      compositeMap.set(key, [...(compositeMap.get(key) ?? []), index]);
    });

    const duplicatedPn = [...pnMap.entries()]
      .filter(([, indexes]) => indexes.length > 1)
      .map(([pn, indexes]) => ({ pn, indexes }));

    const duplicatedComposite = [...compositeMap.entries()]
      .filter(([, indexes]) => indexes.length > 1)
      .map(([key, indexes]) => {
        const [pn, type] = key.split("::");
        return { pn, type, indexes };
      });

    await testInfo.attach("duplicate-pn-observation.json", {
      body: Buffer.from(JSON.stringify(duplicatedPn, null, 2), "utf8"),
      contentType: "application/json"
    });

    await testInfo.attach("duplicate-pn-type-failure-check.json", {
      body: Buffer.from(JSON.stringify(duplicatedComposite, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(duplicatedComposite, "pn + type should not have duplicate records").toEqual([]);
  });
});
