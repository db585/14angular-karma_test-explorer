import { KarmaEvent } from "./../../model/karma-event";
import { TestState } from "../../model/enums/test-state.enum";
import { TestEvent, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent } from "vscode-test-adapter-api";
import { TestResultToTestStateMapper } from "../test-explorer/test-result-to-test-state.mapper";
import * as vscode from "vscode";

export class EventEmitter {
  public constructor(
    private readonly eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {}

  public emitTestStateEvent(testName: string, testState: TestState) {
    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;
    this.eventEmitterInterface.fire(testEvent);
  }

  public emitTestResultEvent(testName: string, karmaEvent: KarmaEvent) {
    const testResultMapper = new TestResultToTestStateMapper();
    const testState = testResultMapper.Map(karmaEvent.results.status);

    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;

    if (karmaEvent.results.failureMessages.length > 0) {
      testEvent.message = karmaEvent.results.failureMessages[0];
    }

    this.eventEmitterInterface.fire(testEvent);
  }
}
