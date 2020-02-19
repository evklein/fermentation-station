export const FirebaseConfig = {
    apiKey: process.env.REACT_APP_FERMSTAT_API_KEY,
    authDomain: process.env.REACT_APP_FERMSTAT_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FERMSTAT_DATABASE_URL,
    projectId: process.env.REACT_APP_FERMSTAT_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FERMSTAT_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FERMSTAT_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FERMSTAT_APP_ID,
    measurementId: process.env.REACT_APP_FERMSTAT_MEASUREMENT_ID
}

/* A quick note: I have previously committed database credentials to this repo from this file accidentally.
   I've switched over to environment variables to make this no longer happen. All previously committed credentials
   have been disposed of.
 */