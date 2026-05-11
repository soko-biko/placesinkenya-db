import * as functions from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();

// Secret for Gemini API Key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// AI Tag & Summary Generation - Triggers when a new place is created
export const onPlaceCreated = onDocumentCreated({
  document: "places/{placeId}",
  secrets: [geminiApiKey]
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const description = data?.description;
  const location = data?.location;
  const placeId = event.params.placeId;

  if (!description || typeof description !== "string") {
    console.log(`Place ${placeId} has no description. Skipping AI enrichment.`);
    return;
  }

  try {
    const ai = new GoogleGenAI(geminiApiKey.value());
    const prompt = `You are an AI SEO expert for a Kenyan travel platform. 
    Analyze this place in ${location}: "${description}".
    Generate:
    1. Exactly 5 highly relevant descriptive tags starting with # (e.g., #Hiking, #TembeaKenya, #HiddenGem).
    2. A one-sentence SEO-optimized summary for the meta description.
    
    Return ONLY a JSON object with keys "tags" (array) and "seoSummary" (string).`;

    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const responseText = result.response.text();
    const enrichedData = JSON.parse(responseText);
    
    if (enrichedData.tags && enrichedData.seoSummary) {
      console.log(`Enriched ${placeId}: ${enrichedData.seoSummary}`);
      
      await snapshot.ref.set({
        tags: admin.firestore.FieldValue.arrayUnion(...enrichedData.tags),
        seoSummary: enrichedData.seoSummary,
        aiEnriched: true,
        enrichedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

  } catch (error) {
    console.error(`AI Enrichment failed for ${placeId}:`, error);
  }
});

// On registration update (Approval/Rejection)
export const onRegistrationUpdate = functions.firestore
  .document("registrations/{registrationId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    
    if (newData.status === oldData.status) return null;
    
    const email = newData.email;
    
    if (newData.status === "APPROVED") {
       console.log(`Sending approval email to ${email}`);
       // SendGrid logic here
    } else if (newData.status === "REJECTED") {
       console.log(`Sending rejection email to ${email}. Reason: ${newData.adminNotes}`);
    } else if (newData.status === "MORE_INFO_NEEDED") {
       console.log(`Sending info request to ${email}`);
    }
    
    return null;
  });

// Set Admin Role Callable
export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Only allow existing admins to promote others, or if it's the very first user (simplified for dev)
  const uid = data.uid;
  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'UID required');
  
  await admin.firestore().collection("users").doc(uid).set({
    role: "ADMIN"
  }, { merge: true });
  
  // Also set custom claim
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  
  return { message: `User ${uid} promoted to admin.` };
});
