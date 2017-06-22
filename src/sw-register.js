/* eslint-disable no-console */

import serviceWorker from "./service-worker";

export default async function registerServiceWorker() {
  try {
    const registration = await serviceWorker({ scope: "/" });

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;

      installingWorker.onstatechange = () => {
        switch (installingWorker.state) {
          case "installed":
            if (navigator.serviceWorker.controller) {
              console.log("new update has been found");
            } else {
              console.log("content is now available offline");
            }
            break;
          case "redundant":
            console.log("the installing service worker became redundant");
            break;
          default:
            break;
        }
      };
    };
  } catch (error) {
    console.error("error during service worker registration:", error);
  }
}
