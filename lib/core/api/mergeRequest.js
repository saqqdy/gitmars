'use strict';

const { red } = require("colors");
const request = require("../request");
const getConfig = require("../getConfig");
const { debug } = require("../utils/debug");
const config = getConfig();
const MERGE_REQUESTS_URL = `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`;
async function createMergeRequest({
  source_branch,
  target_branch,
  description,
  token
}) {
  const params = {
    source_branch,
    target_branch,
    title: `Merge branch '${source_branch}' into '${target_branch}'`,
    private_token: token
  };
  if (description)
    params.description = description;
  const fetchData = await request.post({
    url: MERGE_REQUESTS_URL,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestList({
  state = "opened",
  token
}) {
  const params = {
    state,
    private_token: token
  };
  const fetchData = await request.get({
    url: MERGE_REQUESTS_URL,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestCommits({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_URL}/${iid}/commits`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestCloseIssues({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_URL}/${iid}/closes_issues`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestParticipants({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_URL}/${iid}/participants`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestChanges({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_URL}/${iid}/changes`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestDiffVersions({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_URL}/${iid}/versions`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function acceptMergeRequest({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.put({
    url: `${MERGE_REQUESTS_URL}/${iid}/merge`,
    data: params,
    options: { error: true }
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    if (message === "500 Internal Server Error")
      return true;
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function updateMergeRequest({
  iid,
  token,
  data = {}
}) {
  data.private_token = token;
  const fetchData = await request.put({
    url: `${MERGE_REQUESTS_URL}/${iid}`,
    data,
    options: { error: true }
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    if (message === "500 Internal Server Error")
      return true;
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function deleteMergeRequest({
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.delete({
    url: `${MERGE_REQUESTS_URL}/${iid}`,
    data: params,
    options: { error: true }
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    if (message === "500 Internal Server Error")
      return true;
    return Promise.reject(red(message));
  }
  return fetchData;
}
module.exports = {
  createMergeRequest,
  getMergeRequestList,
  getMergeRequestCommits,
  getMergeRequestCloseIssues,
  getMergeRequestParticipants,
  getMergeRequestChanges,
  getMergeRequestDiffVersions,
  acceptMergeRequest,
  updateMergeRequest,
  deleteMergeRequest
};
