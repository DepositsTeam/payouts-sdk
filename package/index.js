let wrapper, iframe;
let callbackFunc, redirectURL, onPageClosed;
let ip, browser, device, fingerprint, country, city, isp;

fetch("http://ip-api.com/json")
  .then(function (response) {
    // The API call was successful!
    return response.json();
  })
  .then(function (data) {
    // This is the JSON from our response
    ip = data.query;
    country = data.country;
    city = data.city;
    isp = data.isp;
  })
  .catch(function (err) {
    // There was an error
    console.warn("Something went wrong.", err);
  });

if (
  (navigator.userAgent.indexOf("Opera") ||
    navigator.userAgent.indexOf("OPR")) !== -1
) {
  browser = "Opera";
} else if (navigator.userAgent.indexOf("Chrome") !== -1) {
  browser = "Chrome";
} else if (navigator.userAgent.indexOf("Safari") !== -1) {
  browser = "Safari";
} else if (navigator.userAgent.indexOf("Firefox") !== -1) {
  browser = "Firefox";
} else if (
  navigator.userAgent.indexOf("MSIE") !== -1 ||
  !!document.documentMode === true
) {
  browser = "IE"; //crap
} else {
  browser = "Unknown";
}

const ua = {
  "Generic Linux": /Linux/i,
  Android: /Android/i,
  BlackBerry: /BlackBerry/i,
  Bluebird: /EF500/i,
  "Chrome OS": /CrOS/i,
  Datalogic: /DL-AXIS/i,
  Honeywell: /CT50/i,
  iPad: /iPad/i,
  iPhone: /iPhone/i,
  iPod: /iPod/i,
  macOS: /Macintosh/i,
  Windows: /IEMobile|Windows/i,
  Zebra: /TC70|TC55/i,
};
Object.keys(ua).map((v) => navigator.userAgent.match(ua[v]) && (device = v));

// Initialize the agent at application startup.
const fpPromise = new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.onload = resolve;
  script.onerror = reject;
  script.async = true;
  script.src =
    "https://cdn.jsdelivr.net/npm/" +
    "@fingerprintjs/fingerprintjs-pro@3/dist/fp.min.js";
  document.head.appendChild(script);
}).then(() => FingerprintJS.load({ apiKey: "vZOLWDQeWgM0iZV7t1sV" }));

// Get the visitor identifier when you need it.
fpPromise
  .then((fp) => fp.get())
  .then((result) => {
    // console.log(result.visitorId);
    fingerprint = result.visitorId;
  });

function DepositsPayouts({
  public_key,
  callback,
  on_page_closed,
  production_env = false,
  use_localhost = false,
}) {
  callbackFunc = callback;
  onPageClosed = on_page_closed;
  if (document.getElementById("deposits_payouts_frame_wrapper")) {
  } else {
    let apiUrl = "";
    if (use_localhost) {
      apiUrl = "http://localhost:3000";
    } else {
      apiUrl = production_env
        ? "https://payout.sdk.deposits.dev"
        : "https://dev.payout.sdk.deposits.dev";
    }

    const generateUrl = `${apiUrl}/${public_key}/`;

    // console.log(generateUrl);
    iframe = document.createElement("iframe");
    iframe.src = generateUrl;
    iframe.style.backgroundColor = "#fff";
    iframe.style.position = "fixed";
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.zIndex = "999999999999";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.transition = "left 1s ease, bottom 1s ease, right 1s ease";
    wrapper = document.createElement("div");
    wrapper.id = "deposits_payouts_frame_wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.border = "none";
    wrapper.style.width = "100%";
    wrapper.style.height = "100vh";
    wrapper.style.zIndex = "999999999999";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.transition = "left 1s ease, bottom 1s ease, right 1s ease";
    document.body.appendChild(wrapper);
    wrapper.appendChild(iframe);
  }
}

window.addEventListener("message", function (event) {
  if (typeof event.data === "string") {
    if (event.data === "closeIframe") {
      wrapper.parentNode.removeChild(wrapper);
      if (typeof onPageClosed === "function") {
        onPageClosed();
      }
      if (typeof callbackFunc === "function") {
        callbackFunc();
      }
    }
    if (event.data.substring(0, 9) === "completed") {
      if (redirectURL) {
        const serialize = function (obj) {
          let str = [];
          for (let p in obj)
            if (obj.hasOwnProperty(p)) {
              str.push(
                encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])
              );
            }
          return str.join("&");
        };
        const returned = JSON.parse(event.data.substring(9));
        let objParams = {};
        if (returned.data.transaction_id) {
          objParams.transaction_id = returned.data.transaction_id;
        }
        if (returned.data.reference) {
          objParams.reference = returned.data.reference;
        }
        if (returned.data.id) {
          objParams.id = returned.data.id;
        }
        window.location = redirectURL + "?" + serialize(objParams);
      } else {
        const returned = JSON.parse(event.data.substring(9));
        if (typeof callbackFunc === "function") {
          callbackFunc(returned);
        }
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  }
});

export default DepositsPayouts;
