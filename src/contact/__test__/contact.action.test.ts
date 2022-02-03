import * as nock from "nock";
import * as zapier from "zapier-platform-core";
import {
  CreateCompanyAction,
  CreatePersonAction,
  UpdateCompanyAction,
  UpdatePersonAction,
} from "../contact.action";
import * as errorResponse from "./unprocessableContact.fixture.json";
import App from "../..";

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const mockEmptyCustomFieldsResponse = () => {
  nock("https://api.getbase.com/v2/contact")
    .get("/custom_fields")
    .reply(200, { items: [] });
};

describe("create contact person action", () => {
  it("should pass if person is properly created", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        last_name: "John",
        "address.line1": "Street",
        "address.postal_code": "1234",
        tags: ["a", "b", "c"],
        "custom_fields.multi_select": ["A", "B"],
        "custom_fields.second_name": "Vito",
      },
    };

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/contacts", {
        data: {
          last_name: "John",
          address: {
            line1: "Street",
            postal_code: "1234",
          },
          is_organization: false,
          tags: ["a", "b", "c"],
          custom_fields: {
            multi_select: ["A", "B"],
            second_name: "Vito",
          },
        },
      })
      .reply(200, { data: { id: 1230 } });

    const response = await appTester(
      App.creates[CreatePersonAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(1230);
  });

  it("should throw error with details if 4xx is returned from API while creating person", async () => {
    const contactData = {
      last_name: "John",
      invalid_field: "Invalid Field",
    };

    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        ...contactData,
      },
    };

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/contacts", {
        data: {
          ...contactData,
          is_organization: false,
        },
      })
      .reply(422, errorResponse);

    try {
      await appTester(
        App.creates[CreatePersonAction.key].operation.perform,
        bundle
      );
      // expect.fail(null, null, "422 API response should throw exception")
    } catch (e: any) {
      expect(e.message).toContain("422");
    }
  });
});

describe("create company action", () => {
  it("should pass if company is properly created", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        name: "Base CRM",
        parent_organization_id: 140,
        "address.state": "WA",
      },
    };

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/contacts", {
        data: {
          name: "Base CRM",
          parent_organization_id: 140,
          address: {
            state: "WA",
          },
          is_organization: true,
        },
      })
      .reply(200, { data: { id: 500 } });

    const response = await appTester(
      App.creates[CreateCompanyAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(500);
  });
});

describe("update person action", () => {
  it("should pass if person is properly updated", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        id: 600,
        first_name: "Uzi",
        last_name: "Shmilovici",
      },
    };

    nock("https://api.getbase.com/v2")
      .get("/contacts/600")
      .reply(200, { data: { id: 600 } });
    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .put("/contacts/600", {
        data: {
          first_name: "Uzi",
          last_name: "Shmilovici",
        },
      })
      .reply(200, { data: { id: 600 } });

    const response = await appTester(
      App.creates[UpdatePersonAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(600);
  });
});

describe("update company action", () => {
  it("should pass if company is properly updated", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        id: 100,
        name: "Base CRM",
        "address.state": "CA",
      },
    };

    nock("https://api.getbase.com/v2")
      .get("/contacts/100")
      .reply(200, { data: { id: 100 } });
    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .put("/contacts/100", {
        data: {
          name: "Base CRM",
          address: {
            state: "CA",
          },
        },
      })
      .reply(200, { data: { id: 100 } });

    const response = await appTester(
      App.creates[UpdateCompanyAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(100);
  });
});
