"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.main = void 0;
var core_1 = require("@actions/core");
var rest_1 = require("@octokit/rest");
var codeowners_generator_1 = require("codeowners-generator");
var simple_git_1 = require("simple-git");
var git = simple_git_1["default"]();
var github = require('@actions/github');
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var GITHUB_TOKEN, octokit, status, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Creating check run...");
                GITHUB_TOKEN = core_1.getInput('githubToken');
                octokit = new rest_1.Octokit({
                    auth: GITHUB_TOKEN
                });
                status = "in_progress";
                payload = {
                    "name": "CODEOWNERS Check",
                    "owner": github.context.payload.repository.owner.login,
                    "repo": github.context.payload.repository.name,
                    "head_sha": github.context.sha,
                    "status": status,
                    "output": {
                        "title": "Checking CODEOWNERS",
                        "summary": "This check ensures the root CODEOWNERS file was updated to reflect any nested CODEOWNERS files."
                    }
                };
                console.log("Payload: " + JSON.stringify(payload));
                return [4 /*yield*/, octokit.checks.create(payload)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var finish = function (conclusion) { return __awaiter(void 0, void 0, void 0, function () {
    var GITHUB_TOKEN, octokit, status, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Marking check run successful...");
                GITHUB_TOKEN = core_1.getInput('githubToken');
                octokit = new rest_1.Octokit({
                    auth: GITHUB_TOKEN
                });
                console.log("Github context: " + JSON.stringify(github.context));
                status = "completed";
                switch (conclusion) {
                    case "success":
                        payload = {
                            "owner": github.context.payload.repository.owner.login,
                            "repo": github.context.payload.repository.name,
                            "check_run_id": github.context.payload.check_run.id,
                            "status": status,
                            "output": {
                                "title": "CODEOWNERS Correct!",
                                "summary": "This check ensures the root CODEOWNERS file was updated to reflect any nested CODEOWNERS files."
                            },
                            "conclusion": conclusion
                        };
                        break;
                    case "failure":
                        payload = {
                            "owner": github.context.payload.repository.owner.login,
                            "repo": github.context.payload.repository.name,
                            "check_run_id": github.context.payload.check_run.id,
                            "status": status,
                            "output": {
                                "title": "Missing CODEOWNERS Changes",
                                "summary": "Looks like the root CODEOWNERS file has not been updated to reflect nested CODEOWNERS changes. Please run `codeowners-generator generate` and commit to fix."
                            },
                            "conclusion": conclusion
                        };
                        break;
                }
                console.log("Payload: " + JSON.stringify(payload));
                return [4 /*yield*/, octokit.checks.update(payload)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var checkCodeOwners = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Checking codeowners...");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                // Check if CODEOWNERS file is correct by running codeowners-generator and ensuring no changes
                return [4 /*yield*/, codeowners_generator_1.generateCommand({ parent: {} })];
            case 2:
                // Check if CODEOWNERS file is correct by running codeowners-generator and ensuring no changes
                _a.sent();
                console.log("Called codeowners - check if any change");
                return [4 /*yield*/, git.status()];
            case 3:
                result = _a.sent();
                if (!result.isClean()) return [3 /*break*/, 5];
                console.log("CODEOWNERS ok!");
                return [4 /*yield*/, finish("success")];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                console.log("Need to fix codeowners");
                return [4 /*yield*/, finish("failure")];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var action, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                action = core_1.getInput('action');
                _a = action;
                switch (_a) {
                    case "START": return [3 /*break*/, 1];
                    case "CHECK_CODEOWNERS": return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, start()];
            case 2:
                _b.sent();
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, checkCodeOwners()];
            case 4:
                _b.sent();
                return [3 /*break*/, 6];
            case 5: throw new Error("Invalid action - " + action);
            case 6: return [2 /*return*/];
        }
    });
}); };
