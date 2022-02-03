import * as nock from "nock";
import App from "../../..";
import * as zapier from "zapier-platform-core";
import * as taskErrorResponse from "./taskErrorResponse.fixture.json";
import { CreateTaskAction } from "../task.action";

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("create task action", () => {
  it("should pass if task is properly created", async () => {
    const bundle = {
      inputData: {
        content: "This is task",
        due_date: "2018-09-02T16:45:58Z",
        resource_type: "Lead",
        resource_id: 12345,
        owner_id: 100,
        invalid_filter: "invalid",
      },
    };

    nock("https://api.getbase.com/v2")
      .post("/tasks", {
        data: {
          content: "This is task",
          due_date: "2018-09-02T16:45:58Z",
          resource_type: "lead",
          resource_id: 12345,
          owner_id: 100,
        },
      })
      .reply(200, { data: { id: 1230 } });

    const response: any = await appTester(
      App.creates[CreateTaskAction.key].operation.perform,
      bundle
    );
    expect(response.id).toEqual(1230);
  });

  it("should pass custom value used in resource_type to api", async () => {
    const bundle = {
      inputData: {
        content: "This is task",
        due_date: "2018-09-02T16:45:58Z",
        resource_type: "leadzz",
        resource_id: 12345,
        owner_id: 100,
      },
    };

    nock("https://api.getbase.com/v2")
      .post("/tasks", {
        data: {
          content: "This is task",
          due_date: "2018-09-02T16:45:58Z",
          resource_type: "leadzz",
          resource_id: 12345,
          owner_id: 100,
        },
      })
      .reply(422, taskErrorResponse);

    try {
      await appTester(
        App.creates[CreateTaskAction.key].operation.perform,
        bundle
      );
    } catch (e: any) {
      expect(e.message).toContain("422");
    }
  });
});
