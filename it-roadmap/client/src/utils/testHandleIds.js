/**
 * Test script to verify the handle ID fixes
 *
 * This script can be run in the browser console to test our handle ID
 * normalization functions and ensure they work correctly.
 */

import { fixHandleId } from "./reactflowUtils";
import { fixBottomTargetSourceIssue } from "./edgeUtils";

function testHandleIdFixes() {
  console.log("======== TESTING HANDLE ID FIXES ========");

  // Test source handle fixes
  console.log("\n--- SOURCE HANDLE TESTS ---");
  const sourceHandles = [
    "bottom-target", // problematic case
    "bottom-target-source", // problematic case
    "bottom",
    "bottom-source",
    "top",
    "top-source",
    "right",
    "right-target",
    "right-source",
  ];

  sourceHandles.forEach((handle) => {
    console.log(
      `Original: "${handle}" → Fixed: "${fixHandleId(handle, "source")}"`
    );
  });

  // Test target handle fixes
  console.log("\n--- TARGET HANDLE TESTS ---");
  const targetHandles = [
    "bottom-source", // problematic case
    "bottom",
    "bottom-target",
    "top-source", // problematic case
    "top",
    "left",
    "left-source",
    "right-target",
    "right",
  ];

  targetHandles.forEach((handle) => {
    console.log(
      `Original: "${handle}" → Fixed: "${fixHandleId(handle, "target")}"`
    );
  });

  // Test connection fixes
  console.log("\n--- CONNECTION FIX TESTS ---");
  const connections = [
    // The problematic case from the error
    {
      sourceHandle: "bottom-target",
      targetHandle: "top",
      source: "node-html1",
      target: "node-database1",
    },
    // Other problematic cases
    {
      sourceHandle: "bottom-target-source",
      targetHandle: "top",
      source: "node-1",
      target: "node-2",
    },
    {
      sourceHandle: "bottom",
      targetHandle: "top-source",
      source: "node-3",
      target: "node-4",
    },
    // Right-to-right connection tests (new issue)
    {
      sourceHandle: "right",
      targetHandle: "right",
      source: "node-html1",
      target: "node-database1",
    },
    {
      sourceHandle: "right-source",
      targetHandle: "right",
      source: "node-html1",
      target: "node-database1",
    },
    {
      sourceHandle: "right",
      targetHandle: "right-target",
      source: "node-html1",
      target: "node-database1",
    },
    {
      sourceHandle: "right-source",
      targetHandle: "right-target",
      source: "node-html1",
      target: "node-database1",
    },
    // LTW to Database connection tests (new issue)
    {
      sourceHandle: "right",
      targetHandle: "left",
      source: "node-ltw01",
      target: "node-database1",
    },
    {
      sourceHandle: "bottom",
      targetHandle: "top",
      source: "node-ltw01",
      target: "node-database1",
    },
    // Database to LTW connection tests
    {
      sourceHandle: "left",
      targetHandle: "right",
      source: "node-database1",
      target: "node-ltw01",
    },
  ];

  connections.forEach((conn) => {
    console.log("Original:", conn);
    const fixed = fixBottomTargetSourceIssue(conn);
    console.log("Fixed:", fixed);
    console.log("---");
  });

  console.log("======== TESTS COMPLETE ========");
}

// Export the test function so it can be called from the console
export { testHandleIdFixes };

// If this script is loaded directly, run the tests
if (typeof window !== "undefined") {
  window.testHandleIdFixes = testHandleIdFixes;
  console.log("Run tests by calling window.testHandleIdFixes() in the console");
}
