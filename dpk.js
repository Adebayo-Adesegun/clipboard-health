const crypto = require("crypto");

// since these are constants, they can be hoisted to the top of the file
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {

  let candidate;

  // check if event object exists and returns 0 once the event object is empty or undefined
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (event.partitionKey) {
      candidate = event.partitionKey;
  } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  if (typeof candidate !== "string" || candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};