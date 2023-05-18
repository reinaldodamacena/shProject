import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCVsBOEe1HKUUojcyVk_b3JYKNWnT7MMxI",
    authDomain: "shproject-386513.firebaseapp.com",
    projectId: "shproject-386513",
    storageBucket: "shproject-386513.appspot.com",
    messagingSenderId: "634591630805",
    appId: "1:634591630805:web:26efa25f46f5a68a9cd95c",
    measurementId: "G-7ESGELXX9K"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export function initializeFirebaseMessaging() {
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
    };

    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
      new Notification(notificationTitle, notificationOptions);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        }
      });
    }
  });
}

export function requestNotificationPermission() {
    return messaging
      .requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return messaging.getToken();
      })
      .then((token) => {
        console.log('FCM token:', token);
        return token;
      })
      .catch((error) => {
        console.log('Unable to get permission to notify.', error);
        return null;
      });
  }

export function getToken() {
  return messaging.getToken({vapidKey: 'NGR0IHWKlH2mBaZ7oBvsNQDO1pKsqoWpA_ooGNg8u90'});
}
