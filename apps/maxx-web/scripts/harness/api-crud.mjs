import process from "node:process";

const baseUrl = process.env.HARNESS_BASE_URL ?? "http://localhost:3000";

// Helper to make requests
async function makeRequest(method, path, body = null) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    };

    if (body) {
      opts.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${path}`, opts);
    clearTimeout(timeout);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else if (response.status !== 204) {
      data = await response.text();
    }

    return { status: response.status, data };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Request timeout on ${method} ${path}`);
    }
    throw err;
  }
}

// Test runner
async function runTests() {
  const tests = [];
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    tests.push({ name, fn });
  }

  // Set up test data
  const testContact = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "555-1234",
    status: "lead",
    source: "manual",
    tags: ["test"],
  };

  const testOpportunity = {
    pipelineId: "pipe_123",
    stageId: "stage_1",
    contactId: "", // Will be set after contact creation
    title: "Test Deal",
    value: 5000,
  };

  let createdContactId = null;
  let createdOpportunityId = null;

  // CONTACTS TESTS
  test("POST /api/contacts (create)", async () => {
    const { status, data } = await makeRequest(
      "POST",
      "/api/contacts",
      testContact
    );
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.contact || !data.contact.id)
      throw new Error("No contact ID returned");
    createdContactId = data.contact.id;
  });

  test("GET /api/contacts (list)", async () => {
    const { status, data } = await makeRequest("GET", "/api/contacts");
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.contacts))
      throw new Error("contacts is not an array");
  });

  test("GET /api/contacts?offset=0&limit=10 (pagination)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/contacts?offset=0&limit=10"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.contacts))
      throw new Error("contacts is not an array");
    if (typeof data.total !== "number")
      throw new Error("total is not a number");
    if (typeof data.offset !== "number")
      throw new Error("offset is not a number");
    if (typeof data.limit !== "number")
      throw new Error("limit is not a number");
  });

  test("GET /api/contacts?status=lead (filter by status)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/contacts?status=lead"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.contacts))
      throw new Error("contacts is not an array");
  });

  test("GET /api/contacts?source=manual (filter by source)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/contacts?source=manual"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.contacts))
      throw new Error("contacts is not an array");
  });

  test("PATCH /api/contacts/:id (update)", async () => {
    if (!createdContactId) throw new Error("No contact ID from creation");
    const { status, data } = await makeRequest(
      "PATCH",
      `/api/contacts/${createdContactId}`,
      {
        firstName: "Updated",
      }
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (data.contact.firstName !== "Updated")
      throw new Error("firstName not updated");
  });

  test("PATCH /api/contacts/:id with tags", async () => {
    if (!createdContactId) throw new Error("No contact ID from creation");
    const { status, data } = await makeRequest(
      "PATCH",
      `/api/contacts/${createdContactId}`,
      {
        tags: ["updated", "tag"],
      }
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.contact.tags))
      throw new Error("tags is not an array");
  });

  test("PATCH /api/contacts/nonexistent (404)", async () => {
    const { status } = await makeRequest(
      "PATCH",
      "/api/contacts/nonexistent_id",
      {
        firstName: "Test",
      }
    );
    if (status !== 404) throw new Error(`Expected 404, got ${status}`);
  });

  // OPPORTUNITIES TESTS
  test("POST /api/pipeline (create opportunity)", async () => {
    if (!createdContactId) throw new Error("No contact ID from creation");
    const opp = { ...testOpportunity, contactId: createdContactId };
    const { status, data } = await makeRequest("POST", "/api/pipeline", opp);
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.opportunity || !data.opportunity.id)
      throw new Error("No opportunity ID returned");
    createdOpportunityId = data.opportunity.id;
  });

  test("GET /api/pipeline (list opportunities)", async () => {
    const { status, data } = await makeRequest("GET", "/api/pipeline");
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.opportunities))
      throw new Error("opportunities is not an array");
  });

  test("GET /api/pipeline?offset=0&limit=10 (pagination)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/pipeline?offset=0&limit=10"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.opportunities))
      throw new Error("opportunities is not an array");
    if (typeof data.total !== "number")
      throw new Error("total is not a number");
  });

  test("GET /api/pipeline?stageId=stage_1 (filter by stage)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/pipeline?stageId=stage_1"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.opportunities))
      throw new Error("opportunities is not an array");
  });

  test("GET /api/pipeline?pipelineId=pipe_123 (filter by pipeline)", async () => {
    const { status, data } = await makeRequest(
      "GET",
      "/api/pipeline?pipelineId=pipe_123"
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data.opportunities))
      throw new Error("opportunities is not an array");
  });

  test("PATCH /api/pipeline/:id (move deal to stage)", async () => {
    if (!createdOpportunityId)
      throw new Error("No opportunity ID from creation");
    const { status, data } = await makeRequest(
      "PATCH",
      `/api/pipeline/${createdOpportunityId}`,
      {
        stageId: "stage_2",
      }
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (data.opportunity.stageId !== "stage_2")
      throw new Error("stageId not updated");
  });

  test("PATCH /api/pipeline/:id with value update", async () => {
    if (!createdOpportunityId)
      throw new Error("No opportunity ID from creation");
    const { status, data } = await makeRequest(
      "PATCH",
      `/api/pipeline/${createdOpportunityId}`,
      {
        value: 7500,
        title: "Updated Deal",
      }
    );
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (data.opportunity.value !== 7500) throw new Error("value not updated");
    if (data.opportunity.title !== "Updated Deal")
      throw new Error("title not updated");
  });

  test("DELETE /api/contacts/:id", async () => {
    if (!createdContactId) throw new Error("No contact ID from creation");
    const { status } = await makeRequest(
      "DELETE",
      `/api/contacts/${createdContactId}`
    );
    if (status !== 204) throw new Error(`Expected 204, got ${status}`);
  });

  test("DELETE /api/pipeline/:id", async () => {
    if (!createdOpportunityId)
      throw new Error("No opportunity ID from creation");
    const { status } = await makeRequest(
      "DELETE",
      `/api/pipeline/${createdOpportunityId}`
    );
    if (status !== 204) throw new Error(`Expected 204, got ${status}`);
  });

  // Run all tests
  console.log("Running API CRUD tests...\n");
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\n${passed} passed, ${failed} failed out of ${tests.length} tests.`
  );
  return failed === 0;
}

// Check server is reachable
console.log(`Testing API at ${baseUrl}\n`);
try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  const response = await fetch(`${baseUrl}/api/health`, {
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (!response.ok) {
    console.error(`Server returned ${response.status} on /api/health`);
    process.exit(1);
  }
} catch (err) {
  console.error(`Cannot reach server at ${baseUrl}: ${err.message}`);
  console.log("Make sure the dev server is running (npm run dev)\n");
  process.exit(1);
}

// Run tests
const success = await runTests();
process.exit(success ? 0 : 1);
