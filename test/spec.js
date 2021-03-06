const code = require("../index");
const assert = require("assert");
const nock = require("nock");

const CLIENT_EMAIL = "test-account@fast-ability-145401.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwmz3cjee+in8k\nAnruXf/2q9VfgJfjykK2oDIkjUZJs61tPZyOeD3m+9Fqn62/vzAtvQVO9RzYlnH6\n/1hTl/NsNhd+kwehP230+NVwizfuzsVgsteVlSKHPgQs3uOLuBU4RIZE/KPzuWzS\nKO3bMVQb00Yo5G2MjEupA6cHx4ng0qUevYGdS9k+Z01Msx8Cw55nwibpLyZW1QEW\nKIfY9q31FIsgbjw3ODhM9Rtvy3lgbY/N02buzlKCb3Tz+plr/IAnkgVTwQJMvT2t\nr9BvWyHhArsbRPLNF35ZuHrT6/tnRt1pZbU9vGccIKFlBJ3vVZhFPiGIJF5EKVNt\nmtlE7cdnAgMBAAECggEACuhW3nlJov9enksK7A/HmdgZRYM/N+6+xq6UbXG0sb06\n5mBwrwbAWzSzxYz9yBx9hy2n/ZO7YUMorTk566I0aVTaVNNG6ULuJLwW23mCjfZp\nj8qr8JpCUWEKrl/7yzemekNKABb5SoadMOO3QRtfiv82OgG8JGFora32K7XuwmeV\n13/E/KeT8P9FfMh462Iakppty0OaXkL5KCZqq9l8+NizpxcbCqc/+P5y5MB2/tWY\n5jiooAIiyaSbeydgS+CX15+biLei6+QpKOlQTdGedVTTTt4Oh8tImhoh7Eha5Lge\nP15QRhFVgCsdb1iSxinuU0p24wcU4g7oyX7z9HsRDQKBgQDkMMBx9WnWOaBmDd6h\nvMc42ckrhsYTRS8LCYfvm+vjiudYeVAhQP3+M01qQOvgXyOe17BPJBlFmBDVKRWQ\nRyEnF8Dg4SmwuNuhWjAPE1wGg1E3yxgtkaFY3TLxKguNuuxQzBUdQ15ILlNkWxqY\nwdsZYiXF8+ySnUolEPYxH6V/LQKBgQDGISJ6bqDwPhiHgCCmV3jPbxVPV/me5ru/\nhg36GC9gg4iQEtwEjNQw3RIPR7gQ6axeWagw1ti4qSnc70n8SGBXBJTT2hg+JZTt\nn8MzHHbz6pmIsiN19o3oev0oxSMSb76Zkw1vxhnRPnOmiqAItfMwM50wHfGpXSCw\nL6qkmgudYwKBgGQ5qX0kLn1CSFoqw1tEoDgvJ/WvN3alT3lIkWVDlcMWcnBgsDo6\n4pRxEhKWO0QMZYfR8oWANH1lwhbt+aOqKjySaUwceYQ+XXEsPKmSdjwCF30q/g6d\nxUFTvplAP1zb+gmu6aM1wMZxWn1cqnznwIUQn8inT4RCA5vuLEP9Q2JtAoGABMw6\nnIJfTVIDoAxfPgfyOfuzpWc4+TsXIs0pO3wocYrd3LdIMqgCX2iLDmmrMGWoMeSz\n6PLa7qXSCLKWtRA/nPvUasjmO2MHlzV+MZen3cI5k5DUwP+GcjHAPaOAdOrVz7w6\n4BEJAQMlI8xJkcxuJiWp0cd32aUSrJGK7U95pocCgYEAt+ha8d650nwc+SjNd68G\nw/IwrNlCGWXSBwg7BR8VKWvoOxFokxxYOchozTu+b/9Y53fO5ZvtW0Zau57QzNU7\nPJYul8I0sMEAzsj0cEuIQEfV4YQ0l1plWkKaZStLIQ6eEWmwJ7Gx2XgOmKVQqD4/\nof4bdrk3H2Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n";

describe("#getRows", () => {
    it("gets a collection of rows", (done) => {
        nock("https://accounts.google.com")
            .post(/.*/)
            .reply(200, {
                refresh_token: "a",
                access_token: "b"
            });
        nock("https://sheets.googleapis.com")
            .get(/v4\/spreadsheets\/.*\/values:batchGet/)
            .reply(200, {
                "spreadsheetId": "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8",
                "valueRanges": [{
                    "range": "'People'!A2:B3",
                    "majorDimension": "ROWS",
                    "values": [
                        ["Kyle", "Coberly"],
                        ["Elyse", "Coberly"]
                    ]
                },{
                    "range": "'Cities'!A2:A4",
                    "majorDimension": "ROWS",
                    "values": [
                        ["Denver"],
                        ["Seattle"]
                    ]
                }]
            });
        code.getRows([{
            label: "people",
            range: "People!A2:B4",
            mapping: ["firstName", "lastName"]
        },{
            label: "cities",
            range: "Cities!A2:A4",
            mapping: ["city"]
        }],{
            spreadsheetId: "9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs",
            clientEmail: CLIENT_EMAIL,
            privateKey: PRIVATE_KEY
        }).then(response => {
            assert.deepEqual(response, {
                people: [{
                    firstName: "Kyle",
                    lastName: "Coberly"
                },{
                    firstName: "Elyse",
                    lastName: "Coberly"
                }],
                cities: [{
                    city: "Denver"
                },{
                    city: "Seattle"
                }]
            });
        }).then(done)
        .catch(done);
    });
});

describe("#_sheets", () => {
    it("exports a batchGet function", () => {
        const sheets = code._sheets();
        assert.ok(sheets.batchGet);
    });
});

describe("#_sheetsToMappedObject", ()=>{
    it("converts a google sheets response to a mapped object", ()=>{
        const fixture = {
            "spreadsheetId": "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8",
            "valueRanges": [{
                "range": "'Project Submissions'!A2:B4",
                "majorDimension": "ROWS",
                "values": [
                    [
                        "10/17/2017 12:11:21",
                        "17"
                    ],
                    [
                        "10/17/2017 12:12:18",
                        "15"
                    ],
                    [
                        "10/17/2017 13:02:11",
                        "7"
                    ]
                ]
            },{
                "range": "'Project Submissions'!C2:C3",
                "majorDimension": "ROWS",
                "values": [
                    [
                        "Kevin Kingdon"
                    ],
                    [
                        "Jay Farnsworth"
                    ]
                ]
            }]
        };
        assert.deepEqual(code._sheetsToMappedObject([{
            label: "submissions",
            mapping: ["date", "id"]
        },{
            label: "people",
            mapping: ["name"]
        }], fixture), {
            submissions: [{
                date: "10/17/2017 12:11:21",
                id: "17",
            },{
                date: "10/17/2017 12:12:18",
                id: "15",
            },{
                date: "10/17/2017 13:02:11",
                id: "7",
            }],
            people: [{
                name: "Kevin Kingdon"
            },{
                name: "Jay Farnsworth"
            }]
        });
    });
});

describe("#_rowToMap", ()=>{
    it("converts a google sheets array to an object", ()=>{
        const result = code._rowToMap(["keyOne", "keyTwo"], ["valueOne", "valueTwo"]);
        assert.deepEqual(result, {
            keyOne: "valueOne",
            keyTwo: "valueTwo"
        });
    });
    it("returns an empty object if there are no keys", ()=>{
        assert.deepEqual(code._rowToMap([], ["valueOne", "valueTwo"]), {});
        assert.deepEqual(code._rowToMap(null, ["valueOne", "valueTwo"]), {});
    });
    it("returns an empty object if there are no values", ()=>{
        assert.deepEqual(code._rowToMap(["keyOne", "keyTwo"], []), {});
        assert.deepEqual(code._rowToMap(["keyOne", "keyTwo"], null), {});
    });
    it("returns an empty object if there are no keys or values", ()=>{
        assert.deepEqual(code._rowToMap([], []), {});
        assert.deepEqual(code._rowToMap([], null), {});
        assert.deepEqual(code._rowToMap(null, []), {});
        assert.deepEqual(code._rowToMap(null, null), {});
    });
});

describe("#_rowsToMaps", ()=>{
    it("converts rows to maps", ()=>{
        assert.deepEqual(code._rowsToMaps(["one", "two"], [[1, 2], [3, 4]]), [{one: 1, two: 2}, {one: 3, two: 4}]);
    });
    it("returns empty objects if the row doesn't have values", ()=>{
        assert.deepEqual(code._rowsToMaps([], [[], []]), [{}, {}]);
    });
});

describe("#_getRanges", ()=>{
    it("can extract ranges from row objects", ()=>{
        assert.deepEqual(code._getRanges([{
            range: "A2:B",
        },{
            range: "'Cities'!C2:C",
        }]), ["A2:B", "'Cities'!C2:C"]);
    });
});
