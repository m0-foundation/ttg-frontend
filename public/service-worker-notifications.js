/*
SERVICE WORKER LIFECYCLE
*/
self.addEventListener("install", async function (event) {
  console.log("Service Worker installed");

  const nowSeconds = Math.floor(Date.now() / 1000);
  const nextEpochObj = getNextEpochBasedOnTime(nowSeconds);
  // schedule notifcation to the upcoming epoch
  const delayms = nextEpochObj.delay * 1000;
  const nextNotificationTime = Date.now() + delayms;
  await saveNextNotificationTime("nextNotificationTime", nextNotificationTime); // upcoming epoch timestamp milisecods

  console.log("Worker: install", { nextNotificationTime, nextEpochObj });

  scheduleNotification(nextNotificationTime, delayms);
});

// Check and reschedule notifications when the service worker is activated
self.addEventListener("activate", function (event) {
  console.log("Worker activated");
  event.waitUntil(rescheduleNotification());
});

self.addEventListener("fetch", function (event) {
  console.log("Worker fetch");
  event.waitUntil(rescheduleNotification());
});

async function scheduleNotification(nextNotificationTime, delayms) {
  await saveNextNotificationTime(nextNotificationTime);

  setTimeout(async () => {
    await showNotification(nextNotificationTime);
    // Reschedule the next notification
    await rescheduleNotification();
  }, delayms);
}

async function rescheduleNotification() {
  const nextNotificationTime = await getNextNotificationTime();
  const now = Date.now();
  const delay = nextNotificationTime - now;
  console.log("Worker: rescheduleNotification", nextNotificationTime, {
    delay,
  });
  // if the delay is positive is because the notification was not shown
  if (delay > 0) {
    scheduleNotification(nextNotificationTime, delay);
  } else {
    // If the delay is negative, calculate the next epoch and schedule it
    const nowSeconds = Math.floor(Date.now() / 1000);
    const nextEpochObj = getNextEpochBasedOnTime(nowSeconds);
    const delayms = nextEpochObj.delay * 1000;
    const newNextNotificationTime = nextEpochObj.timestamp * 1000;
    scheduleNotification(newNextNotificationTime, delayms);
  }
}

function showNotification(time) {
  const epoch = getEpochFromTimestamp(time);
  const epochType = getEpochType(epoch);
  console.log("Worker: showNotification", { time, epoch, epochType });

  // const title =
  //   epochType === "transfer"
  //     ? "Transfer Epoch has started"
  //     : "Voting Epoch has started";

  const body =
    epochType === "transfer"
      ? "Transfer Epoch has started! Transfer is now allowed."
      : "Voting Epoch has started! Voting is now allowed.";

  return self.registration.showNotification(`${time} | Mˆ0 Governance`, {
    tag: time, // a unique ID
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
  });
}

self.addEventListener("notificationclick", (event) => {
  if (event.action === "close") {
    event.notification.close();
  } else {
    self.clients.openWindow("https://governance.m0.org/");
  }
});

// Fe sends a message to sw every setup of the app
// self.addEventListener("message", function (event)
// {
//     const data = event.data;
//     trace("Service Worker => onMessage", data);

//     // This should be conditional, and instead of event.data,
//     // you might want to pass event.data.myData
//     // Here unconditional, for simplicity's sake
//     resolveInstall(data); // Here, we resolve the installConfigPromise

//     if (data)
//     {
//         // Do something with the path, like caching it or using it in fetch
//         // trace("self.onMessage received data:", data);
//     }
// });

/*
EPOCH FUNCTIONS
*/

//mainnet
// const EPOCH_STARTING_TIMESTAMP = 1_713_099_600;
// const EPOCH_PERIOD_SECONDS = 1_296_000;

//sepolia
const EPOCH_STARTING_TIMESTAMP = 1_714_154_183;
const EPOCH_PERIOD_SECONDS = 900;

function getNextEpochBasedOnTime(timeseconds) {
  const currentEpoch = getCurrentEpoch();
  const nextEpoch = currentEpoch + 1;
  const nextEpochTimestamp = getTimestampOfEpochStart(nextEpoch);
  const delay = nextEpochTimestamp - timeseconds;

  return {
    delay,
    timestamp: nextEpochTimestamp,
    epoch: nextEpoch,
    type: getEpochType(nextEpoch),
  };
}

function getEpochFromTimestamp(timestamp) {
  return (
    Math.floor((timestamp - this.clockStartingTimestamp) / this.clockPeriod) + 1
  );
}

function getTimestampOfEpochStart(epoch) {
  return (epoch - 1) * EPOCH_PERIOD_SECONDS + EPOCH_STARTING_TIMESTAMP;
}

function getCurrentEpoch(timestamp = Math.floor(Date.now() / 1000)) {
  return (
    Math.floor((timestamp - EPOCH_STARTING_TIMESTAMP) / EPOCH_PERIOD_SECONDS) +
    1
  );
}

function getEpochType(epoch) {
  return epoch % 2 === 0 ? "transfer" : "voting";
}

/*
INDEXED DB
*/

// Initialize IndexedDB
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

async function saveNextNotificationTime(time) {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["notificationStore"], "readwrite");
      const store = transaction.objectStore("notificationStore");
      const request = store.put(time, "nextNotificationTime");

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function (event) {
        console.log("Worker: initDB save onerror", {
          error: event.target.error,
        });
        reject(event.target.error);
      };
    });
  });
}

// Retrieve the next notification time from IndexedDB
async function getNextNotificationTime() {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["notificationStore"], "readonly");
      const store = transaction.objectStore("notificationStore");
      const request = store.get("nextNotificationTime");

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        console.log("Worker: initDB get onerror", {
          error: event.target.error,
        });
        reject(event.target.error);
      };
    });
  });
}
