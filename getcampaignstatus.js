import { check } from "k6";
import { Rate } from "k6/metrics";
import http from "k6/http";
export let errorRate = new Rate("errors");

export function setup() {
    return {
        contextApi: 'https://now2-api.line-apps.com/v2/linenowbot/users/getcampaignstatus/622ee5ff57a0bf0949bccec6',
        requestHeaders: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.0cjy_q8CJ2Lh9yxBxbHboKZgUd_3g9UkpQp7judXskB_dF8aU0mEGH0j-Jnm5tU-G3LeaT8Pqu4ggE1Tv7pTvvAQ-37bs-G7_HUcY0Re1nnvYJjPSYY543fj7IeT_klfI9wMbo5afiVM_vAGNGQYjgz3d7_hrTenavVf2La_-3s._457ReNE0sLfu0CFbKNsK1CTO6KBma8oG0UvfgwK1ww"
            }

        }
    };
}

export default function (data) {
    // Execute multiple requests in parallel like a browser, to fetch the responses
    let resps = http.batch([
        ["GET", data.contextApi, null, data.requestHeaders]
    ]);
    try {
        // Combine check() call with failure tracking
        if (!check(resps, {
            "Status is 200": (r) => r[0].status === 200,
            "User profile is present": (r) => r[0].body.indexOf("event") !== -1,
        })) {
            errorRate.add(1)
        }
    } catch (error) {
        errorRate.add(1)
        console.log('get unexpect error')
    }
};
