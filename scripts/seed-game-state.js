/**
 * One-time script to create the gameState/current document in Firestore.
 * Run with: node scripts/seed-game-state.js
 *
 * Requires Firebase Admin SDK or you can run this from Firebase Console manually.
 * For simplicity, create the document manually in Firebase Console:
 *
 * Collection: gameState
 * Document ID: current
 * Fields:
 *   currentQuestionId: "q1" (string)
 *   isActive: false (boolean)
 *   updatedAt: <ISO timestamp> (string)
 *
 * Or use the Firebase Console to add the first document.
 */

console.log(`
To initialize gameState, create this document in Firebase Console:

Collection: gameState
Document ID: current

Fields:
  currentQuestionId: "q1"
  isActive: false
  updatedAt: "${new Date().toISOString()}"

Or run: npm run seed (if you add firebase-admin and a service account).
`);
