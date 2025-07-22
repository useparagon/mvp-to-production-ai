import { createActivity, createSyncedObject, createUser, getUser } from "./queries";

const sampleRecordData = [];

const sampleActivityData = [
  {
    "id": "74bc42a4-e3bd-576f-8ea3-ef11daf50e09",
    "event": "record_updated",
    "source": "googledrive",
    "receivedAt": new Date("2025-07-21T15:59:00Z"),
    "data": {
      "model": "File",
      "synced_at": "2025-07-21T12:59:00Z",
      "num_records": 1
    }
  },
]

export async function insertSampleData() {
  console.log("Inserting sample synced objects...");
  let i = 0;
  for (const record of sampleRecordData) {
    let source = "googledrive";
    if (i == 2) {
      source = "box";
    } else if (i == 4) {
      source = "dropbox";
    }
    console.log(source);

    const data = JSON.stringify({
      name: record.name,
      mime_type: record.mime_type,
      size: record.size,
      url: record.url,
      thumbnail_url: record.thumbnail_url,
      hash: record.hash
    });

    try {
      await createSyncedObject({
        id: record.id,
        externalId: record.external_id,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at),
        userId: "jack.mu@useparagon.com",
        data,
        source: source,
        objectType: "File Storage"
      });
      console.log(`Inserted record: ${record.name}`);
      i += 1;
    } catch (error) {
      console.error(`Failed to insert record ${record.name}:`, error);
    }
  }

  for (const record of sampleActivityData) {
    try {
      await createActivity({
        event: record.event,
        syncId: "4cd6fbf3-ca22-5d1d-813c-e73156f9b012",
        source: record.source,
        receivedAt: new Date(record.receivedAt),
        userId: "jack.mu@useparagon.com",
        data: JSON.stringify(record.data),
        objectType: "File Storage"
      });
      console.log(`Inserted record: ${record.event}`);
    } catch (error) {
      console.error(`Failed to insert record ${record.id}:`, error);
    }
    console.log("Sample data insertion complete!");
  }
}

// Run the script if called directly
if (require.main === module) {
  insertSampleData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error("Error inserting sample data:", error);
    process.exit(1);
  });
}
