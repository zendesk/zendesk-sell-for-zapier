import * as nock from "nock";
import App from "../..";
import * as zapier from "zapier-platform-core";
import {
  CreateLeadAction,
  DeprecatedCreateOrUpdateLeadAction,
  UpdateLeadAction,
} from "../lead.action";
import * as errorResponse from "./unprocessableLead.fixture.json";

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const mockEmptyCustomFieldsResponse = () => {
  nock("https://api.getbase.com/v2/lead")
    .get("/custom_fields")
    .reply(200, { items: [] });
};

describe("create lead action", () => {
  it("should pass if lead is properly created", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        organization_name: "Base CRM",
        "address.line1": "Street",
        "address.postal_code": "1234",
        tags: ["a", "b", "c"],
        "custom_fields.field1.one": "one",
        "custom_fields.address.line1": "Address",
      },
    };

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/leads", {
        data: {
          organization_name: "Base CRM",
          address: {
            line1: "Street",
            postal_code: "1234",
          },
          tags: ["a", "b", "c"],
          custom_fields: {
            "field1.one": "one",
            address: {
              line1: "Address",
            },
          },
        },
      })
      .reply(200, { data: { id: 100 } });

    const response = await appTester(
      App.creates[CreateLeadAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(100);
  });

  it("should throw error with details if 4xx is returned from API while creating lead", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        last_name: "Smith",
        unsupported_field: "Value100",
      },
    };

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/leads", {
        data: {
          last_name: "Smith",
          unsupported_field: "Value100",
        },
      })
      .reply(422, errorResponse);

    try {
      await appTester(
        App.creates[CreateLeadAction.key].operation.perform,
        bundle
      );
    } catch (e: any) {
      expect(e.message).toContain("422");
    }
  });

  it("should throw error if validation fails", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        first_name: "John Smith",
      },
    };

    try {
      await appTester(
        App.creates[CreateLeadAction.key].operation.perform,
        bundle
      );
    } catch (e: any) {
      expect(e.message).toContain(
        "Make sure a lead has at least Last Name or Company Name provided."
      );
    }
  });
});

describe("update lead action", () => {
  it("should pass if lead is properly updated", async () => {
    const bundle = {
      authData: {
        api_token: "api token",
      },
      inputData: {
        id: 100,
        first_name: "Uzi",
        last_name: "Shmilovici",
        organization_name: "Base CRM",
      },
    };

    nock("https://api.getbase.com/v2")
      .get("/leads/100")
      .reply(200, { data: { id: 100 } });
    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .put("/leads/100", {
        data: {
          first_name: "Uzi",
          last_name: "Shmilovici",
          organization_name: "Base CRM",
        },
      })
      .reply(200, { data: { id: 100 } });

    const response = await appTester(
      App.creates[UpdateLeadAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(100);
  });
});

describe("create or update lead action", () => {
  const bundle = {
    authData: {
      api_token: "token",
    },
    inputData: {
      id: 200,
      last_name: "Josh",
    },
  };

  it("should create new lead if one with provided id doesn't exist", async () => {
    nock("https://api.getbase.com/v2").get("/leads/200").reply(404);

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .post("/leads", {
        data: {
          last_name: "Josh",
        },
      })
      .reply(200, { data: { id: 200 } });
    try {
      const response = await appTester(
        App.creates[DeprecatedCreateOrUpdateLeadAction.key].operation.perform,
        bundle
      );
      expect(response.id).toEqual(200);
    } catch (e: any) {
      expect(e.message).toContain("200");
    }
  });

  it("should perform update if lead exists", async () => {
    nock("https://api.getbase.com/v2")
      .get("/leads/200")
      .times(2)
      .reply(200, { data: { id: 200 } });

    mockEmptyCustomFieldsResponse();
    nock("https://api.getbase.com/v2")
      .put("/leads/200", {
        data: {
          last_name: "Josh",
        },
      })
      .reply(200, { data: { id: 200 } });

    const response = await appTester(
      App.creates[DeprecatedCreateOrUpdateLeadAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(200);
  });
});
