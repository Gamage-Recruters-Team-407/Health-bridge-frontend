
const { MongoClient } = require("mongodb");

const uri = "mongodb://hirunahansindugamage_db_user:4iSJFnCbtvECylD5@ac-5pyc1nb-shard-00-00.2tysxzi.mongodb.net:27017,ac-5pyc1nb-shard-00-01.2tysxzi.mongodb.net:27017,ac-5pyc1nb-shard-00-02.2tysxzi.mongodb.net:27017/?ssl=true&replicaSet=atlas-q3tlbn-shard-0&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("health-bridge-dev");
    const coll = db.collection("lab_results");
    
    const doc = {
        "_class": "lk.gamage.backend.healthbridgebackend.model.LabResult",
        "testOrderId": "ORD-800",
        "sampleId": "SMP-500",
        "patientId": "6a9517b59c3fd780d8cfcf85",
        "parameters": [
            {
                "parameterName": "Lipid Profile (Cholesterol)",
                "value": "240",
                "unit": "mg/dL",
                "referenceRange": "< 200 mg/dL",
                "outOfRange": true
            }
        ],
        "isCritical": false,
        "isAbnormal": true,
        "verifiedBy": "Tech. Amanda Smith",
        "status": "PUBLISHED",
        "resultedAt": new Date(),
        "publishedAt": new Date()
    };
    
    await coll.insertOne(doc);
    console.log("Successfully injected the second lab result!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

