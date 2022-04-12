import { check } from "k6";
import { Rate } from "k6/metrics";
import http from "k6/http";
export let errorRate = new Rate("errors");

export function setup() {
    return {
        contextApi: 'https://now2-api.line-apps.com/v2/linenowbot/campaigns/622ee5ff57a0bf0949bccec6',
        requestHeaders: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.8fdStCFACYXhT-4ODJ8BEZ1P6J2jpXO5sfhe8UoaKjNYjaScp-31D_lEEdz9eLWf6bhkO7z7twTRB3qMc3S0ebYUuYQtx-pWhKl7_itaCuJK1iUWub149Arlde25gfGW2VMIDa8EYnx5aSljJ7QrAF3oEw7qTlbx3LYwQXxcNC4.zBPX4yAubDB4xK74mQHlgi0gw1Sp_R1mMowvk_QZ7A4"
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
