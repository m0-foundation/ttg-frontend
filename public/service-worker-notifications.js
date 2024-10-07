/*
SERVICE WORKER LIFECYCLE

Considerations:
The user opens the app within that period of epoch at least once, triggering the fetch/activate event to reschedule.
*/
self.addEventListener("install", function (event) {
  console.log("Service Worker installed");
  self.skipWaiting(); // Immediately activate new service worker
  event.waitUntil(scheduleNotification());
});

// Check and reschedule notifications when the service worker is activated
self.addEventListener("activate", (event) => {
  console.log("Worker activated");
  event.waitUntil(rescheduleNotification());
});

// Check and reschedule notifications when the service worker is activated
self.addEventListener("fetch", function (event) {
  console.log("Worker fetch");
  event.waitUntil(rescheduleNotification());
});

async function rescheduleNotification() {
  const lastNotificationTime = await getLastNotificationTime();
  // This means it’s the first time scheduling, or the last notification time wasn’t saved properly.
  if (!lastNotificationTime) {
    await scheduleNotification();
  }
}

async function scheduleNotification() {
  const now = Date.now();
  const nextEpochObj = getNextEpoch();
  const delayms = nextEpochObj.timestamp - now;
  const nextNotificationTime = nextEpochObj.timestamp; // needs to be in milliseconds

  console.log("Worker: scheduleNotification", nextEpochObj.epoch, delayms);

  /*
  If the service worker is terminated before the setTimeout callback triggers, the notification won’t be scheduled, 
  and there won’t be a record of the last notification time.
  */
  // Save the next notification time before setting the timeout
  await saveLastNotificationTime(nextNotificationTime);

  setTimeout(async () => {
    const epoch = getEpochFromTimestamp(nextNotificationTime / 1000); // needs to be in seconds
    const epochType = getEpochType(epoch);
    // Check if the user was already notified for this epoch type
    const lastNotifiedEpoch = await getLastNotifiedEpoch();
    console.log("Worker: lastNotifiedEpoch", { lastNotifiedEpoch });
    if (lastNotifiedEpoch !== epoch) {
      await showNotification(nextNotificationTime, epoch, epochType);
      await saveLastNotifiedEpoch(epoch); // Update to the latest notified epoch
    }
    scheduleNotification(); // Reschedule next notification
  }, delayms);
}

function showNotification(time, epoch, epochType) {
  console.log("Worker: showNotification", { time, epoch, epochType });

  const body =
    epochType === "transfer"
      ? "Transfer Epoch has started! Transfer is now allowed."
      : "Voting Epoch has started! Voting is now allowed.";

  return self.registration.showNotification(
    `Epoch #${epoch} | Mˆ0 Governance`,
    {
      tag: `epoch-${epoch}`, // a unique ID
      body: body,
      actions: [
        {
          action: "open",
          title: "Open governance",
        },
        {
          action: "close",
          title: "Close notification",
        },
      ],
      badge: "/favicon.png",
      icon: "/favicon.png",
    },
  );
}

self.addEventListener("notificationclick", (event) => {
  if (event.action === "close") {
    event.notification.close();
  } else {
    self.clients.openWindow("https://governance.m0.org/");
  }
});

/*
EPOCH FUNCTIONS
*/

//mainnet
// const EPOCH_STARTING_TIMESTAMP = 1_713_099_600;
// const EPOCH_PERIOD_SECONDS = 1_296_000;

//sepolia
const EPOCH_STARTING_TIMESTAMP = 1_714_154_183;
const EPOCH_PERIOD_SECONDS = 900;

function getNextEpoch() {
  const currentEpoch = getCurrentEpoch();
  const nextEpoch = currentEpoch + 1;
  const nextEpochTimestampSeconds = getTimestampOfEpochStart(nextEpoch);

  return {
    timestamp: nextEpochTimestampSeconds * 1000,
    epoch: nextEpoch,
    type: getEpochType(nextEpoch),
  };
}

function getEpochFromTimestamp(ts) {
  return Math.floor((ts - EPOCH_STARTING_TIMESTAMP) / EPOCH_PERIOD_SECONDS) + 1;
}

function getTimestampOfEpochStart(epoch) {
  return (epoch - 1) * EPOCH_PERIOD_SECONDS + EPOCH_STARTING_TIMESTAMP;
}

function getCurrentEpoch(ts = Math.floor(Date.now() / 1000)) {
  return Math.floor((ts - EPOCH_STARTING_TIMESTAMP) / EPOCH_PERIOD_SECONDS) + 1;
}

function getEpochType(epoch) {
  return epoch % 2 === 0 ? "transfer" : "voting";
}

/*
INDEXED DB
*/

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("m0-governance-notifications", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore("notificationStore");
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      console.log("Worker: initDB onerror", { error: event.target.error });
      reject(event.target.error);
    };
  });
}

async function getLastNotificationTime() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notificationStore"], "readonly");
    const store = transaction.objectStore("notificationStore");
    const request = store.get("lastNotificationTime");

    request.onsuccess = (event) => resolve(event.target.result || null);
    request.onerror = (event) => {
      console.error(
        "Worker: getLastNotificationTime onerror",
        event.target.error,
      );
      reject(event.target.error);
    };
  });
}

async function saveLastNotificationTime(time) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notificationStore"], "readwrite");
    const store = transaction.objectStore("notificationStore");
    const request = store.put(time, "lastNotificationTime");

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error(
        "Worker: saveLastNotificationTime onerror",
        event.target.error,
      );
      reject(event.target.error);
    };
  });
}

async function getLastNotifiedEpoch() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notificationStore"], "readonly");
    const store = transaction.objectStore("notificationStore");
    const request = store.get("lastNotifiedEpoch");

    request.onsuccess = (event) => resolve(event.target.result || null);
    request.onerror = (event) => {
      console.error("Worker: get onerror", event.target.error);
      reject(event.target.error);
    };
  });
}

async function saveLastNotifiedEpoch(epoch) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notificationStore"], "readwrite");
    const store = transaction.objectStore("notificationStore");
    const request = store.put(epoch, "lastNotifiedEpoch");

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Worker: save onerror", event.target.error);
      reject(event.target.error);
    };
  });
}
