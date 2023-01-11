const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '0' when given an empty string", () => {
    const emptyKey = deterministicPartitionKey("");
    expect(emptyKey).toBe("0");
  });

  it("Returns event partition key when provided", () => {
    const event = {
      partitionKey: "test"
    };
    const key = deterministicPartitionKey(event);
    expect(key).toBe("test");
  });

  it("Returns SHA3-512 hash of event when partition key is not provided", () => {
    const event = { data: "test-data" };
    const data = JSON.stringify(event);
    const expectedHash = crypto.createHash("sha3-512").update(data).digest("hex");
    const result = deterministicPartitionKey(event);
    expect(result).toBe(expectedHash);
  });

  it("returns truncated SHA3-512 hash of partition key when it exceeds maximum length", () => {
    const longKey = "a".repeat(257);
    const event = { partitionKey: longKey };
    const expectedHash = crypto.createHash("sha3-512").update(longKey).digest("hex");
    const result = deterministicPartitionKey(event);
    expect(result).toBe(expectedHash);
  });

});
